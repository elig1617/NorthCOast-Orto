from __future__ import annotations

import json
from pathlib import Path

import httpx
import pytest
import respx

from po_ingest.models import IngestDecision
from po_ingest.pipeline import process_pdf
from po_ingest.smartsuite.client import SmartSuiteClient
from tests.conftest import SAMPLE_OF347, make_pdf


def _table(table_id: str, name: str, fields: list[tuple[str, str, str]]) -> dict:
    return {
        "id": table_id,
        "name": name,
        "primary_field": "title",
        "structure": [
            {
                "slug": slug,
                "label": label,
                "field_type": field_type,
                "params": {"required": False},
            }
            for slug, label, field_type in fields
        ],
    }


TABLES = [
    _table(
        "tbl_orders",
        "Orders",
        [
            ("title", "title", "recordtitlefield"),
            ("po_number", "PO Number", "textfield"),
            ("customer", "Account", "linkedrecordfield"),
            ("contact", "Contact", "linkedrecordfield"),
            ("ship_to", "Ship To", "addressfield"),
            ("source_pdf", "Source PDF", "filefield"),
        ],
    ),
    _table(
        "tbl_lines",
        "Order Lines",
        [
            ("title", "title", "recordtitlefield"),
            ("order", "Order", "linkedrecordfield"),
            ("product", "Product", "linkedrecordfield"),
            ("description", "Description", "textfield"),
            ("quantity", "Quantity", "numberfield"),
            ("unit_price", "Unit Price", "currencyfield"),
            ("amount", "Amount", "currencyfield"),
            ("line_number", "Line", "textfield"),
        ],
    ),
    _table("tbl_accounts", "Accounts", [("title", "title", "recordtitlefield"), ("station", "Station", "textfield")]),
    _table(
        "tbl_contacts",
        "Contacts",
        [
            ("title", "title", "recordtitlefield"),
            ("email", "Email", "emailfield"),
            ("account", "Account", "linkedrecordfield"),
        ],
    ),
    _table("tbl_products", "Products", [("title", "title", "recordtitlefield"), ("sku", "SKU", "textfield")]),
]


def _list_response(items):
    return httpx.Response(200, json={"total": len(items), "offset": 0, "limit": 100, "items": items})


@pytest.fixture
def api():
    with respx.mock(base_url="https://app.smartsuite.com/api/v1", assert_all_called=False) as router:
        router.get("/applications/").mock(return_value=httpx.Response(200, json=TABLES))
        router.post("/applications/tbl_orders/records/list/").mock(
            return_value=_list_response([])
        )
        router.post("/applications/tbl_accounts/records/list/").mock(
            return_value=_list_response(
                [{"id": "acct1", "title": "VA Medical Center Albany", "station": "528"}]
            )
        )
        router.post("/applications/tbl_contacts/records/list/").mock(
            return_value=_list_response(
                [
                    {
                        "id": "c1",
                        "title": "Jane Rivera",
                        "email": ["jane.rivera@va.gov"],
                        "account": ["acct1"],
                    }
                ]
            )
        )
        router.post("/applications/tbl_products/records/list/").mock(
            return_value=_list_response(
                [
                    {"id": "p1", "title": "KNEE BRACE, HINGED, LARGE", "sku": "KB-HL"},
                    {"id": "p2", "title": "WRIST SPLINT, PREFAB, LEFT", "sku": "WS-L"},
                ]
            )
        )
        yield router


def _client() -> SmartSuiteClient:
    return SmartSuiteClient("test-key", "abcd1234")


def test_dry_run_does_not_write(api, mapping, tmp_path):
    pdf = make_pdf(tmp_path / "po.pdf", SAMPLE_OF347)
    create_route = api.post("/applications/tbl_orders/records/")
    result = process_pdf(pdf, mapping=mapping, commit=False, client=_client())
    assert result.decision == IngestDecision.DRY_RUN
    assert not create_route.called
    assert result.filed_path is not None
    assert "review" in str(result.filed_path)


def test_commit_writes_order_lines_and_confirms(api, mapping, tmp_path):
    pdf = make_pdf(tmp_path / "po.pdf", SAMPLE_OF347)
    created_order = {
        "id": "ord1",
        "title": "36C24226N0123",
        "po_number": "36C24226N0123",
        "customer": ["acct1"],
        "contact": ["c1"],
        "ship_to": {
            "location_address": "113 HOLLAND AVENUE",
            "location_city": "ALBANY",
            "location_state": "NY",
            "location_zip": "12208",
        },
    }
    api.post("/applications/tbl_orders/records/").mock(
        return_value=httpx.Response(200, json=created_order)
    )
    api.post("/applications/tbl_lines/records/bulk/").mock(
        return_value=httpx.Response(
            200,
            json=[{"id": "ln1", "quantity": "12"}, {"id": "ln2", "quantity": "6"}],
        )
    )
    api.post(url__regex=r".*/recordfiles/tbl_orders/ord1/source_pdf/").mock(
        return_value=httpx.Response(200, json={"ok": True})
    )
    api.get("/applications/tbl_orders/records/ord1/").mock(
        return_value=httpx.Response(200, json=created_order)
    )

    result = process_pdf(pdf, mapping=mapping, commit=True, client=_client())
    assert result.decision == IngestDecision.COMMITTED
    assert result.written is not None
    assert result.written.order_id == "ord1"
    assert result.written.line_ids == ["ln1", "ln2"]
    assert result.written.confirmed()
    assert result.filed_path is not None
    assert "processed" in str(result.filed_path)
    audit = json.loads(Path(result.audit_path).read_text())
    assert audit["decision"] == "committed"


def test_ambiguous_match_goes_to_review_without_write(api, mapping, tmp_path):
    api.post("/applications/tbl_accounts/records/list/").mock(
        return_value=_list_response(
            [
                {"id": "acct1", "title": "VA Medical Center Albany Downtown"},
                {"id": "acct2", "title": "VA Medical Center Albany Stratton"},
            ]
        )
    )
    pdf = make_pdf(tmp_path / "po.pdf", SAMPLE_OF347.replace("STATION: 528", "").replace("DODAAC: 36C242", ""))
    create_route = api.post("/applications/tbl_orders/records/")
    result = process_pdf(pdf, mapping=mapping, commit=True, client=_client())
    assert result.decision == IngestDecision.REVIEW
    assert not create_route.called


def test_existing_po_is_skipped(api, mapping, tmp_path):
    api.post("/applications/tbl_orders/records/list/").mock(
        return_value=_list_response([{"id": "ord-existing", "po_number": "36C24226N0123"}])
    )
    pdf = make_pdf(tmp_path / "po.pdf", SAMPLE_OF347)
    result = process_pdf(pdf, mapping=mapping, commit=True, client=_client())
    assert result.decision == IngestDecision.SKIPPED
    assert "already exists" in result.message
