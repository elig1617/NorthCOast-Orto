"""Match parsed PO entities to existing SmartSuite records.

Never create customers, contacts, or products. Ambiguous or weak matches
become blockers so the PDF goes to review instead of a wrong hospital.
"""

from __future__ import annotations

from typing import Any

from rapidfuzz import fuzz

from po_ingest.config import MatchingConfig, TableMap
from po_ingest.models import EntityMatch, LineItem, LineMatch, MatchCandidate, PreparedOrder, PurchaseOrder
from po_ingest.smartsuite.client import SmartSuiteClient
from po_ingest.smartsuite.schema import ResolvedSchema, ResolvedTable


def prepare_order(
    client: SmartSuiteClient,
    schema: ResolvedSchema,
    mapping: Any,
    purchase_order: PurchaseOrder,
) -> PreparedOrder:
    matching: MatchingConfig = mapping.matching
    customer = match_customer(
        client, schema.table("customers"), mapping.customers, purchase_order, matching
    )
    contact = match_contact(
        client,
        schema.table("contacts"),
        mapping.contacts,
        purchase_order,
        matching,
        customer_id=customer.candidate.record_id if customer.candidate else None,
    )
    lines = [
        LineMatch(
            line=item,
            product=match_product(
                client, schema.table("products"), mapping.products, item, matching
            ),
        )
        for item in purchase_order.line_items
    ]
    blockers = _blockers(purchase_order, customer, contact, lines)
    return PreparedOrder(
        purchase_order=purchase_order,
        customer=customer,
        contact=contact,
        lines=lines,
        blockers=blockers,
    )


def match_customer(
    client: SmartSuiteClient,
    table: ResolvedTable,
    table_map: TableMap,
    purchase_order: PurchaseOrder,
    matching: MatchingConfig,
) -> EntityMatch:
    queries = [
        value
        for value in (
            purchase_order.customer_name,
            purchase_order.ship_to.name if purchase_order.ship_to else None,
            purchase_order.station_number,
            purchase_order.dodac,
            purchase_order.issuing_office,
        )
        if value
    ]
    return _match_entity(
        client,
        table,
        table_map,
        queries=queries,
        entity="customer",
        matching=matching,
        extra_needles=_customer_needles(purchase_order),
    )


def match_contact(
    client: SmartSuiteClient,
    table: ResolvedTable,
    table_map: TableMap,
    purchase_order: PurchaseOrder,
    matching: MatchingConfig,
    customer_id: str | None,
) -> EntityMatch:
    queries = [
        value
        for value in (
            purchase_order.contact_email,
            purchase_order.contact_name,
        )
        if value
    ]
    if not queries:
        return EntityMatch(
            entity="contact",
            status="missing",
            reason="No contact name or email on the purchase order",
        )
    return _match_entity(
        client,
        table,
        table_map,
        queries=queries,
        entity="contact",
        matching=matching,
        required_link=(table_map.customer_link, customer_id)
        if table_map.customer_link and customer_id
        else None,
    )


def match_product(
    client: SmartSuiteClient,
    table: ResolvedTable,
    table_map: TableMap,
    line: LineItem,
    matching: MatchingConfig,
) -> EntityMatch:
    queries = [value for value in (line.sku, line.nsn, line.manufacturer_part) if value]
    if queries:
        exact = _match_entity(
            client,
            table,
            table_map,
            queries=queries,
            entity="product",
            matching=MatchingConfig(min_score=100, unique_margin=0, product_min_score=100),
            exact_only=True,
        )
        if exact.is_unique:
            return exact
    if not line.description:
        return EntityMatch(
            entity="product",
            status="missing",
            reason="Line has no SKU/NSN and no description",
            query=line.description,
        )
    return _match_entity(
        client,
        table,
        table_map,
        queries=[line.description],
        entity="product",
        matching=MatchingConfig(
            min_score=matching.product_min_score,
            unique_margin=matching.unique_margin,
            product_min_score=matching.product_min_score,
        ),
    )


def _match_entity(
    client: SmartSuiteClient,
    table: ResolvedTable,
    table_map: TableMap,
    *,
    queries: list[str],
    entity: str,
    matching: MatchingConfig,
    extra_needles: list[str] | None = None,
    required_link: tuple[str, str] | None = None,
    exact_only: bool = False,
) -> EntityMatch:
    query = " | ".join(queries)
    if not queries:
        return EntityMatch(
            entity=entity,
            status="missing",
            reason=f"No {entity} identifiers found on the purchase order",
        )

    records = _load_candidates(client, table, table_map, queries, required_link)
    scored = _score_records(records, table, table_map, queries, extra_needles or [])
    if not scored:
        return EntityMatch(
            entity=entity,
            status="unmatched",
            query=query,
            reason=f"No {entity} records matched {query!r}",
        )

    scored.sort(key=lambda item: item.score, reverse=True)
    best = scored[0]
    second = scored[1].score if len(scored) > 1 else 0.0
    threshold = 100.0 if exact_only else matching.min_score
    if best.score < threshold:
        return EntityMatch(
            entity=entity,
            status="unmatched",
            query=query,
            candidate=best,
            candidates=scored[:5],
            reason=f"Best {entity} score {best.score:.1f} is below {threshold}",
        )
    if second and (best.score - second) < matching.unique_margin and best.score < 100:
        return EntityMatch(
            entity=entity,
            status="ambiguous",
            query=query,
            candidate=best,
            candidates=scored[:5],
            reason=(
                f"Multiple {entity} records are too close "
                f"({best.score:.1f} vs {second:.1f})"
            ),
        )
    return EntityMatch(
        entity=entity,
        status="matched",
        query=query,
        candidate=best,
        candidates=scored[:5],
        reason=f"Matched on {best.matched_on} ({best.score:.1f})",
    )


def _load_candidates(
    client: SmartSuiteClient,
    table: ResolvedTable,
    table_map: TableMap,
    queries: list[str],
    required_link: tuple[str, str] | None,
) -> list[dict[str, Any]]:
    filters = []
    if required_link:
        slug, record_id = required_link
        field = table.fields.get(slug) or next(
            (item for item in table.fields.values() if item.label.casefold() == slug.casefold()),
            None,
        )
        if field:
            filters.append(
                {
                    "field": field.slug,
                    "comparison": "has_any_of",
                    "value": [record_id],
                }
            )
    if filters:
        return client.list_all_records(table.id, filters=filters, hydrated=True)

    # Small customer/product catalogs are loaded once per process via list_all.
    # Volume is a handful of POs per week; correctness beats pagination tricks.
    return client.list_all_records(table.id, hydrated=True)


def _score_records(
    records: list[dict[str, Any]],
    table: ResolvedTable,
    table_map: TableMap,
    queries: list[str],
    extra_needles: list[str],
) -> list[MatchCandidate]:
    fields_to_check = _match_field_slugs(table, table_map)
    scored: list[MatchCandidate] = []
    for record in records:
        best_score = 0.0
        matched_on = ""
        for slug in fields_to_check:
            haystack = _stringify(record.get(slug))
            if not haystack:
                continue
            for query in queries:
                score = _similarity(query, haystack)
                if score > best_score:
                    best_score = score
                    matched_on = f"{slug}={haystack}"
            for needle in extra_needles:
                if needle and needle.casefold() in haystack.casefold():
                    score = max(best_score, 96.0)
                    if score > best_score:
                        best_score = score
                        matched_on = f"{slug} contains {needle}"
        if best_score:
            scored.append(
                MatchCandidate(
                    record_id=str(record.get("id")),
                    title=_stringify(record.get(table.primary_field) or record.get("title")),
                    score=best_score,
                    matched_on=matched_on,
                    record=record,
                )
            )
    return scored


def _match_field_slugs(table: ResolvedTable, table_map: TableMap) -> list[str]:
    slugs = [table.primary_field, "title"]
    for name in table_map.match_fields:
        field = table.fields.get(name) or table.mapped.get(name)
        if field is None:
            field = next(
                (
                    item
                    for item in table.fields.values()
                    if item.label.casefold() == name.casefold()
                ),
                None,
            )
        if field:
            slugs.append(field.slug)
        else:
            slugs.append(name)
    # Always include mapped logical fields so SKU/station labels work.
    slugs.extend(field.slug for field in table.mapped.values())
    seen: set[str] = set()
    unique: list[str] = []
    for slug in slugs:
        if slug and slug not in seen:
            seen.add(slug)
            unique.append(slug)
    return unique


def _customer_needles(purchase_order: PurchaseOrder) -> list[str]:
    needles = []
    if purchase_order.station_number:
        needles.append(purchase_order.station_number)
    if purchase_order.dodac:
        needles.append(purchase_order.dodac)
    if purchase_order.ship_to and purchase_order.ship_to.city:
        needles.append(purchase_order.ship_to.city)
    return needles


def _similarity(left: str, right: str) -> float:
    left_n = _normalize(left)
    right_n = _normalize(right)
    if not left_n or not right_n:
        return 0.0
    if left_n == right_n:
        return 100.0
    if left_n in right_n or right_n in left_n:
        return max(95.0, fuzz.ratio(left_n, right_n))
    return float(max(fuzz.ratio(left_n, right_n), fuzz.token_set_ratio(left_n, right_n)))


def _normalize(value: str) -> str:
    return " ".join(value.casefold().replace(",", " ").split())


def _stringify(value: Any) -> str:
    if value is None:
        return ""
    if isinstance(value, list):
        return " ".join(_stringify(item) for item in value)
    if isinstance(value, dict):
        if "sys_root" in value:
            return str(value.get("sys_root") or "")
        if "preview" in value:
            return str(value.get("preview") or "")
        return " ".join(str(item) for item in value.values() if item)
    return str(value)


def _blockers(
    purchase_order: PurchaseOrder,
    customer: EntityMatch,
    contact: EntityMatch,
    lines: list[LineMatch],
) -> list[str]:
    blockers = [f"missing {name}" for name in purchase_order.critical_gaps()]
    blockers.extend(purchase_order.warnings)
    if not customer.is_unique:
        blockers.append(customer.reason or "Customer was not uniquely matched")
    if contact.status == "ambiguous":
        blockers.append(contact.reason or "Contact match is ambiguous")
    if contact.status == "unmatched" and purchase_order.contact_name:
        blockers.append(contact.reason or "Contact was not uniquely matched")
    for index, line in enumerate(lines, start=1):
        if not line.product.is_unique:
            blockers.append(
                f"Line {line.line.line_number or index}: "
                f"{line.product.reason or 'product not uniquely matched'}"
            )
    return blockers
