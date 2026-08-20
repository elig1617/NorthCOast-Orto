from decimal import Decimal

from po_ingest.models import Address
from po_ingest.smartsuite.fields import encode_field, verify_field


def test_linked_record_is_always_an_id_array():
    assert encode_field("linkedrecordfield", "rec123") == ["rec123"]
    assert encode_field("linkedrecordfield", ["rec123", "rec456"]) == ["rec123", "rec456"]


def test_currency_and_quantity_are_numeric_strings():
    assert encode_field("currencyfield", Decimal("45.00")) == "45.00"
    assert encode_field("numberfield", Decimal("12")) == "12"


def test_date_normalizes_slash_format():
    encoded = encode_field("datefield", "08/15/2026")
    assert encoded["date"].startswith("2026-08-15")
    assert encoded["include_time"] is False


def test_address_payload_uses_smartsuite_keys():
    encoded = encode_field(
        "addressfield",
        Address(
            name="VA MEDICAL CENTER ALBANY",
            line1="113 HOLLAND AVENUE",
            city="ALBANY",
            state="NY",
            zip_code="12208",
        ),
    )
    assert encoded["location_address"] == "113 HOLLAND AVENUE"
    assert encoded["location_city"] == "ALBANY"
    assert encoded["location_state"] == "NY"
    assert encoded["location_zip"] == "12208"


def test_verify_accepts_equivalent_numbers_and_dates():
    assert verify_field("currencyfield", Decimal("45.00"), "45.00")
    assert verify_field("datefield", "2026-08-15", {"date": "2026-08-15T00:00:00Z"})
    assert verify_field("linkedrecordfield", "abc", ["abc"])
    assert not verify_field("linkedrecordfield", "abc", ["xyz"])
