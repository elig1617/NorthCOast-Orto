from po_ingest.matching import match_customer, match_product, prepare_order
from po_ingest.models import LineItem
from po_ingest.smartsuite.schema import ResolvedField, ResolvedSchema, ResolvedTable


def _table(key, name, table_id, fields, mapped_names=None, primary="title"):
    resolved_fields = {
        slug: ResolvedField(slug=slug, label=label, field_type="textfield", required=False, params={})
        for slug, label in fields.items()
    }
    mapped = {name: resolved_fields[slug] for name, slug in (mapped_names or fields).items() if slug in resolved_fields}
    return ResolvedTable(
        key=key,
        name=name,
        id=table_id,
        primary_field=primary,
        fields=resolved_fields,
        mapped=mapped,
    )


def _schema():
    return ResolvedSchema(
        tables={
            "customers": _table(
                "customers",
                "Accounts",
                "tbl_accounts",
                {"title": "Name", "station": "Station"},
            ),
            "contacts": _table(
                "contacts",
                "Contacts",
                "tbl_contacts",
                {"title": "Name", "email": "Email", "account": "Account"},
                mapped_names={"title": "title", "email": "email"},
            ),
            "products": _table(
                "products",
                "Products",
                "tbl_products",
                {"title": "Name", "sku": "SKU"},
            ),
            "orders": _table("orders", "Orders", "tbl_orders", {"title": "Name", "po_number": "PO Number"}),
            "order_lines": _table("order_lines", "Order Lines", "tbl_lines", {"title": "Name"}),
        }
    )


class FakeClient:
    def __init__(self, records):
        self.records = records

    def list_all_records(self, table_id, **kwargs):
        return list(self.records.get(table_id, []))


def test_unique_customer_match(sample_po, mapping):
    client = FakeClient(
        {
            "tbl_accounts": [
                {"id": "acct1", "title": "VA Medical Center Albany", "station": "528"},
                {"id": "acct2", "title": "VA Medical Center Boston", "station": "523"},
            ]
        }
    )
    match = match_customer(client, _schema().table("customers"), mapping.customers, sample_po, mapping.matching)
    assert match.is_unique
    assert match.candidate.record_id == "acct1"


def test_ambiguous_customer_goes_to_review(sample_po, mapping):
    client = FakeClient(
        {
            "tbl_accounts": [
                {"id": "acct1", "title": "VA Medical Center Albany Downtown"},
                {"id": "acct2", "title": "VA Medical Center Albany Stratton"},
            ]
        }
    )
    sample_po.station_number = None
    sample_po.dodac = None
    match = match_customer(client, _schema().table("customers"), mapping.customers, sample_po, mapping.matching)
    assert match.status == "ambiguous"
    assert not match.is_unique


def test_product_prefers_exact_sku(sample_po, mapping):
    client = FakeClient(
        {
            "tbl_products": [
                {"id": "p1", "title": "Knee Brace Hinged Large", "sku": "KB-HL"},
                {"id": "p2", "title": "Knee Brace Hinged Medium", "sku": "KB-HM"},
            ]
        }
    )
    match = match_product(
        client,
        _schema().table("products"),
        mapping.products,
        sample_po.line_items[0],
        mapping.matching,
    )
    assert match.is_unique
    assert match.candidate.record_id == "p1"


def test_prepare_order_blocks_when_product_missing(sample_po, mapping):
    client = FakeClient(
        {
            "tbl_accounts": [{"id": "acct1", "title": "VA Medical Center Albany", "station": "528"}],
            "tbl_contacts": [
                {
                    "id": "c1",
                    "title": "Jane Rivera",
                    "email": ["jane.rivera@va.gov"],
                    "account": ["acct1"],
                }
            ],
            "tbl_products": [{"id": "p9", "title": "Unrelated Crutch", "sku": "CR-1"}],
        }
    )
    prepared = prepare_order(client, _schema(), mapping, sample_po)
    assert not prepared.can_commit()
    assert any("product" in blocker.lower() or "Line" in blocker for blocker in prepared.blockers)
