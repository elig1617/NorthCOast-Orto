from decimal import Decimal

from po_ingest.pdf_extract import ExtractedPdf
from po_ingest.va_po_parser import parse_extracted
from tests.conftest import SAMPLE_OF347, make_pdf


def test_parses_of347_header_and_lines(tmp_path):
    extracted = ExtractedPdf(path=tmp_path / "po.pdf", text=SAMPLE_OF347, tables=[])
    po = parse_extracted(extracted)

    assert po.po_number == "36C24226N0123"
    assert po.contract_number == "36F79724D0012"
    assert po.requisition_number == "528-26-1-1234-0001"
    assert po.order_date == "2026-08-15"
    assert po.station_number == "528"
    assert po.dodac == "36C242"
    assert po.contact_name == "Jane Rivera"
    assert po.contact_email == "jane.rivera@va.gov"
    assert po.ship_to is not None
    assert po.ship_to.city == "ALBANY"
    assert po.ship_to.state == "NY"
    assert po.ship_to.zip_code == "12208"
    assert "ALBANY" in (po.customer_name or "")
    assert len(po.line_items) == 2
    assert po.line_items[0].quantity == Decimal("12")
    assert po.line_items[0].unit_price == Decimal("45.00")
    assert po.line_items[0].amount == Decimal("540.00")
    assert po.total_amount == Decimal("651.00")
    assert not po.critical_gaps()


def test_parses_line_items_from_table(tmp_path):
    text = "ORDER NUMBER  36C24226N9999\nSHIP TO\nVA MEDICAL CENTER\n100 MAIN ST\nBOSTON MA 02114\n"
    tables = [
        [
            ["ITEM NO.", "DESCRIPTION", "QUANTITY", "UNIT", "UNIT PRICE", "AMOUNT"],
            ["0001", "ANKLE STIRRUP", "4", "EA", "32.00", "128.00"],
        ]
    ]
    po = parse_extracted(ExtractedPdf(path=tmp_path / "po.pdf", text=text, tables=tables))
    assert po.line_items[0].description == "ANKLE STIRRUP"
    assert po.line_items[0].quantity == Decimal("4")


def test_refuses_to_guess_when_po_number_is_ambiguous(tmp_path):
    text = """
    CONTRACT NUMBER 36F79724D0012
    RELATED ORDER 36C24226N0123
    PRIOR ORDER 36C24226N0999
    SHIP TO
    VA MEDICAL CENTER
    100 MAIN ST
    BOSTON MA 02114
    0001  KNEE BRACE  2  EA  10.00  20.00
    """
    po = parse_extracted(ExtractedPdf(path=tmp_path / "po.pdf", text=text, tables=[]))
    assert po.po_number == ""
    assert "po_number" in po.critical_gaps()


def test_extracts_text_from_generated_pdf(tmp_path):
    from po_ingest.pdf_extract import extract_pdf

    path = make_pdf(tmp_path / "sample.pdf", "ORDER NUMBER  36C24226N0123")
    extracted = extract_pdf(path)
    assert "36C24226N0123" in extracted.text
