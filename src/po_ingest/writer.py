"""Create the SmartSuite order, line items, attach the PDF, then read it back."""

from __future__ import annotations

from decimal import Decimal
from pathlib import Path
from typing import Any

from po_ingest.config import MappingConfig
from po_ingest.models import PreparedOrder, PurchaseOrder, VerificationIssue, WrittenOrder
from po_ingest.smartsuite.client import SmartSuiteClient
from po_ingest.smartsuite.fields import encode_field, verify_field
from po_ingest.smartsuite.schema import ResolvedSchema, ResolvedTable


LOGICAL_ORDER_VALUES = {
    "title": lambda po, prepared: po.po_number,
    "po_number": lambda po, prepared: po.po_number,
    "contract_number": lambda po, prepared: po.contract_number,
    "requisition_number": lambda po, prepared: po.requisition_number,
    "order_date": lambda po, prepared: po.order_date,
    "delivery_date": lambda po, prepared: po.delivery_date,
    "ship_to_name": lambda po, prepared: po.ship_to.name if po.ship_to else None,
    "ship_to_address": lambda po, prepared: po.ship_to,
    "issuing_office": lambda po, prepared: po.issuing_office,
    "station_number": lambda po, prepared: po.station_number,
    "dodac": lambda po, prepared: po.dodac,
    "customer": lambda po, prepared: prepared.customer.candidate.record_id
    if prepared.customer.candidate
    else None,
    "contact": lambda po, prepared: prepared.contact.candidate.record_id
    if prepared.contact.candidate
    else None,
    "notes": lambda po, prepared: _notes(po),
    "total_amount": lambda po, prepared: po.total_amount,
}

LOGICAL_LINE_VALUES = {
    "title": lambda line, order_id, product_id: f"{line.line_number or ''} {line.description}".strip(),
    "line_number": lambda line, order_id, product_id: line.line_number,
    "description": lambda line, order_id, product_id: line.description,
    "quantity": lambda line, order_id, product_id: line.quantity,
    "unit": lambda line, order_id, product_id: line.unit,
    "unit_price": lambda line, order_id, product_id: line.unit_price,
    "amount": lambda line, order_id, product_id: line.amount
    if line.amount is not None
    else _amount(line.quantity, line.unit_price),
    "sku": lambda line, order_id, product_id: line.sku,
    "nsn": lambda line, order_id, product_id: line.nsn,
    "order": lambda line, order_id, product_id: order_id,
    "product": lambda line, order_id, product_id: product_id,
}


def find_existing_order(
    client: SmartSuiteClient,
    schema: ResolvedSchema,
    purchase_order: PurchaseOrder,
) -> dict[str, Any] | None:
    orders = schema.table("orders")
    po_field = orders.field("po_number") or orders.fields.get(orders.primary_field)
    if po_field is None:
        return None
    comparison = "is" if po_field.field_type in {"textfield", "recordtitlefield"} else "is"
    page = client.list_records(
        orders.id,
        filters=[{"field": po_field.slug, "comparison": comparison, "value": purchase_order.po_number}],
        limit=5,
    )
    items = page.get("items") or []
    return items[0] if items else None


def commit_order(
    client: SmartSuiteClient,
    schema: ResolvedSchema,
    mapping: MappingConfig,
    prepared: PreparedOrder,
    pdf_path: Path,
) -> WrittenOrder:
    orders = schema.table("orders")
    lines_table = schema.table("order_lines")
    po = prepared.purchase_order

    existing = find_existing_order(client, schema, po)
    if existing:
        return WrittenOrder(
            order_id=str(existing.get("id")),
            order_url=client.record_url(orders.id, str(existing.get("id"))),
            issues=[
                VerificationIssue(
                    field="po_number",
                    expected=po.po_number,
                    actual="existing record already present; refused to write a duplicate",
                )
            ],
        )

    order_payload = _order_payload(orders, mapping, prepared)
    created = client.create_record(orders.id, order_payload)
    order_id = str(created["id"])

    line_payloads = []
    expected_lines: list[tuple[dict[str, Any], dict[str, Any]]] = []
    for line_match in prepared.lines:
        product_id = (
            line_match.product.candidate.record_id if line_match.product.candidate else None
        )
        payload = _line_payload(lines_table, line_match.line, order_id, product_id)
        line_payloads.append(payload)
        expected_lines.append((payload, {"quantity": line_match.line.quantity}))

    created_lines = (
        client.bulk_create_records(lines_table.id, line_payloads) if line_payloads else []
    )
    line_ids = [str(item.get("id")) for item in created_lines if item.get("id")]

    uploaded = False
    pdf_field = orders.field("source_pdf")
    if pdf_field and pdf_field.field_type == "filefield":
        client.upload_file(orders.id, order_id, pdf_field.slug, pdf_path)
        uploaded = True

    fetched = client.get_record(orders.id, order_id)
    issues = _verify_order(orders, order_payload, fetched, prepared, line_ids)
    return WrittenOrder(
        order_id=order_id,
        order_url=client.record_url(orders.id, order_id),
        line_ids=line_ids,
        uploaded_pdf=uploaded,
        issues=issues,
    )


def _order_payload(
    table: ResolvedTable, mapping: MappingConfig, prepared: PreparedOrder
) -> dict[str, Any]:
    po = prepared.purchase_order
    payload: dict[str, Any] = {}
    for logical, resolver in LOGICAL_ORDER_VALUES.items():
        field = table.field(logical)
        if field is None:
            continue
        value = resolver(po, prepared)
        if value is None or value == "":
            continue
        encoded = encode_field(field.field_type, value)
        if encoded is not None:
            payload[field.slug] = encoded
    if mapping.orders.status_slug and mapping.orders.status_value:
        payload[mapping.orders.status_slug] = encode_field(
            "statusfield", mapping.orders.status_value
        )
    return payload


def _line_payload(
    table: ResolvedTable, line: Any, order_id: str, product_id: str | None
) -> dict[str, Any]:
    payload: dict[str, Any] = {}
    for logical, resolver in LOGICAL_LINE_VALUES.items():
        field = table.field(logical)
        if field is None:
            continue
        value = resolver(line, order_id, product_id)
        if value is None or value == "":
            continue
        encoded = encode_field(field.field_type, value)
        if encoded is not None:
            payload[field.slug] = encoded
    return payload


def _verify_order(
    table: ResolvedTable,
    payload: dict[str, Any],
    fetched: dict[str, Any],
    prepared: PreparedOrder,
    line_ids: list[str],
) -> list[VerificationIssue]:
    issues: list[VerificationIssue] = []
    for logical in ("po_number", "title", "customer", "contact", "ship_to_address"):
        field = table.field(logical)
        if field is None or field.slug not in payload:
            continue
        expected = payload[field.slug]
        actual = fetched.get(field.slug)
        if not verify_field(field.field_type, expected, actual):
            issues.append(
                VerificationIssue(
                    field=logical,
                    expected=str(expected),
                    actual=str(actual),
                )
            )
    if len(line_ids) != len(prepared.lines):
        issues.append(
            VerificationIssue(
                field="line_items",
                expected=str(len(prepared.lines)),
                actual=str(len(line_ids)),
            )
        )
    return issues


def _notes(po: PurchaseOrder) -> str:
    parts = []
    if po.form_type:
        parts.append(f"Form: {po.form_type}")
    if po.contractor:
        parts.append(f"Contractor: {po.contractor}")
    if po.warnings:
        parts.append("Warnings: " + "; ".join(po.warnings))
    return "\n".join(parts)


def _amount(quantity: Decimal, unit_price: Decimal | None) -> Decimal | None:
    if unit_price is None:
        return None
    return (quantity * unit_price).quantize(Decimal("0.01"))
