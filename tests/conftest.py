from __future__ import annotations

from decimal import Decimal
from pathlib import Path

import pytest

from po_ingest.config import MappingConfig, MatchingConfig, TableMap, FieldMap
from po_ingest.models import Address, LineItem, PurchaseOrder


SAMPLE_OF347 = """
ORDER FOR SUPPLIES OR SERVICES
OPTIONAL FORM 347 (REV. 2/2012)

1. DATE OF ORDER  08/15/2026
2. CONTRACT NUMBER  36F79724D0012
3. ORDER NUMBER  36C24226N0123
4. REQUISITION/REFERENCE NUMBER  528-26-1-1234-0001

5. ISSUING OFFICE
DEPARTMENT OF VETERANS AFFAIRS
VA MEDICAL CENTER ALBANY
113 HOLLAND AVENUE
ALBANY NY 12208

6. SHIP TO
a. NAME OF CONSIGNEE VA MEDICAL CENTER ALBANY
b. STREET ADDRESS 113 HOLLAND AVENUE
c. CITY ALBANY
d. STATE NY
e. ZIP CODE 12208

STATION: 528
SHIP TO DODAAC: 36C242

CONTRACTING OFFICER: Jane Rivera
PHONE: 518-555-0100
EMAIL: jane.rivera@va.gov

ITEM NO.  SUPPLIES/SERVICES                  QUANTITY  UNIT  UNIT PRICE  AMOUNT
0001      KNEE BRACE, HINGED, LARGE          12        EA    45.00       540.00
0002      WRIST SPLINT, PREFAB, LEFT         6         EA    18.50       111.00

TOTAL AWARD AMOUNT  $651.00
"""


@pytest.fixture
def sample_text() -> str:
    return SAMPLE_OF347


@pytest.fixture
def sample_po() -> PurchaseOrder:
    return PurchaseOrder(
        po_number="36C24226N0123",
        contract_number="36F79724D0012",
        requisition_number="528-26-1-1234-0001",
        order_date="2026-08-15",
        customer_name="VA MEDICAL CENTER ALBANY",
        station_number="528",
        dodac="36C242",
        contact_name="Jane Rivera",
        contact_email="jane.rivera@va.gov",
        ship_to=Address(
            name="VA MEDICAL CENTER ALBANY",
            line1="113 HOLLAND AVENUE",
            city="ALBANY",
            state="NY",
            zip_code="12208",
        ),
        line_items=[
            LineItem(
                line_number="0001",
                description="KNEE BRACE, HINGED, LARGE",
                quantity=Decimal("12"),
                unit="EA",
                unit_price=Decimal("45.00"),
                amount=Decimal("540.00"),
                sku="KB-HL",
            )
        ],
        total_amount=Decimal("651.00"),
        source_text=SAMPLE_OF347,
        form_type="OF347",
    )


@pytest.fixture
def mapping(tmp_path: Path) -> MappingConfig:
    return MappingConfig(
        inbox_dir=tmp_path / "inbox",
        processing_dir=tmp_path / "processing",
        review_dir=tmp_path / "review",
        processed_dir=tmp_path / "processed",
        failed_dir=tmp_path / "failed",
        audit_dir=tmp_path / "audit",
        matching=MatchingConfig(min_score=92, unique_margin=8, product_min_score=94),
        orders=TableMap(
            name="Orders",
            id="tbl_orders",
            fields=FieldMap(
                title="title",
                extras={
                    "po_number": "po_number",
                    "customer": "customer",
                    "contact": "contact",
                    "ship_to_address": "ship_to",
                    "source_pdf": "source_pdf",
                },
            ),
        ),
        order_lines=TableMap(
            name="Order Lines",
            id="tbl_lines",
            fields=FieldMap(
                title="title",
                extras={
                    "order": "order",
                    "product": "product",
                    "description": "description",
                    "quantity": "quantity",
                    "unit_price": "unit_price",
                    "amount": "amount",
                    "line_number": "line_number",
                },
            ),
        ),
        customers=TableMap(
            name="Accounts",
            id="tbl_accounts",
            match_fields=["title", "station"],
            fields=FieldMap(title="title", extras={"station": "station"}),
        ),
        contacts=TableMap(
            name="Contacts",
            id="tbl_contacts",
            match_fields=["title", "email"],
            customer_link="account",
            fields=FieldMap(title="title", extras={"email": "email"}),
        ),
        products=TableMap(
            name="Products",
            id="tbl_products",
            match_fields=["title", "sku"],
            fields=FieldMap(title="title", extras={"sku": "sku"}),
        ),
    )


def make_pdf(path: Path, text: str) -> Path:
    """Write a one-page PDF containing `text` using raw PDF operators."""
    escaped = text.replace("\\", "\\\\").replace("(", "\\(").replace(")", "\\)")
    lines = escaped.splitlines() or [""]
    commands = ["BT", "/F1 10 Tf", "72 720 Td"]
    for index, line in enumerate(lines):
        if index:
            commands.append("0 -12 Td")
        commands.append(f"({line}) Tj")
    commands.append("ET")
    stream = "\n".join(commands)
    objects = [
        "1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj",
        "2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj",
        "3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] "
        "/Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >> endobj",
        f"4 0 obj << /Length {len(stream.encode('latin-1', 'replace'))} >> stream\n{stream}\nendstream endobj",
        "5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj",
    ]
    body = "\n".join(objects) + "\n"
    offsets = []
    cursor = len("%PDF-1.4\n")
    for obj in objects:
        offsets.append(cursor)
        cursor += len(obj) + 1
    xref = ["xref", f"0 {len(objects) + 1}", "0000000000 65535 f "]
    xref.extend(f"{offset:010d} 00000 n " for offset in offsets)
    trailer = (
        "trailer << /Size "
        f"{len(objects) + 1} /Root 1 0 R >>\nstartxref\n{cursor}\n%%EOF\n"
    )
    path.write_bytes(("%PDF-1.4\n" + body + "\n".join(xref) + "\n" + trailer).encode("latin-1", "replace"))
    return path
