"""Parse VA / federal purchase-order text into a structured PurchaseOrder.

Accuracy rule: if a critical field is not clearly labeled, leave it empty and
let the pipeline send the PDF to review. Do not invent values.
"""

from __future__ import annotations

import re
from decimal import Decimal, InvalidOperation
from typing import Iterable

from po_ingest.models import Address, Confidence, LineItem, PurchaseOrder
from po_ingest.pdf_extract import ExtractedPdf


LABEL_PATTERNS: dict[str, list[re.Pattern[str]]] = {
    "po_number": [
        re.compile(r"(?im)^\s*(?:order\s*(?:no\.?|number)|purchase\s*order(?:\s*(?:no\.?|number))?|p\.?o\.?\s*(?:no\.?|number)?)\s*[:#]?\s*([A-Z0-9][A-Z0-9\-/]{4,})$"),
        re.compile(r"(?i)\b(?:order\s*(?:no\.?|number)|purchase\s*order(?:\s*number)?|p\.?o\.?\s*#?)\s*[:#]?\s*([A-Z0-9][A-Z0-9\-/]{4,})"),
    ],
    "contract_number": [
        re.compile(r"(?i)\b(?:contract\s*(?:no\.?|number)|contract\/?\s*order)\s*[:#]?\s*([A-Z0-9][A-Z0-9\-/]{5,})"),
    ],
    "requisition_number": [
        re.compile(r"(?i)\b(?:requisition(?:\/reference)?(?:\s*(?:no\.?|number))?|req(?:uisition)?\s*(?:no\.?|number)?)\s*[:#]?\s*([A-Z0-9][A-Z0-9\-/]{4,})"),
    ],
    "order_date": [
        re.compile(r"(?i)\b(?:date\s*of\s*order|order\s*date|award\/?effective\s*date)\s*[:#]?\s*([0-9]{1,2}[/-][0-9]{1,2}[/-][0-9]{2,4}|[0-9]{4}-[0-9]{2}-[0-9]{2})"),
    ],
    "delivery_date": [
        re.compile(r"(?i)\b(?:delivery\s*date|required\s*delivery|need\s*by|deliver\s*by)\s*[:#]?\s*([0-9]{1,2}[/-][0-9]{1,2}[/-][0-9]{2,4}|[0-9]{4}-[0-9]{2}-[0-9]{2})"),
    ],
    "station_number": [
        re.compile(r"(?i)\b(?:station(?:\s*number)?|sta(?:tion)?\s*#?|va\s*station)\s*[:#]?\s*([0-9]{3}[A-Z0-9]{0,3})"),
    ],
    "dodac": [
        re.compile(r"(?i)\b(?:ship\s*to\s*)?(?:dodaac|dodaa?c)\s*[:#]?\s*([A-Z0-9]{6})"),
    ],
    "contact_name": [
        re.compile(r"(?i)\b(?:ordering\s*officer|contracting\s*officer|buyer|attention|attn|contact(?:\s*name)?)\s*[:#]?\s*([A-Z][A-Za-z.'\-]+(?:[ \t]+[A-Z][A-Za-z.'\-]+){1,3})"),
    ],
    "contact_email": [
        re.compile(r"(?i)\b([A-Z0-9._%+\-]+@[A-Z0-9.\-]+\.[A-Z]{2,})\b"),
    ],
    "contact_phone": [
        re.compile(r"(?i)\b(?:phone|telephone|tel)\s*[:#]?\s*(\(?\d{3}\)?[\s.\-]?\d{3}[\s.\-]?\d{4})"),
    ],
}

VA_PO_RE = re.compile(r"\b(36[A-Z][A-Z0-9]{7,})\b")
MONEY_RE = re.compile(r"\$?\s*([0-9]{1,3}(?:,[0-9]{3})*(?:\.[0-9]{2})|[0-9]+\.[0-9]{2})")
QTY_RE = re.compile(r"^[0-9]+(?:\.[0-9]+)?$")
STATE_RE = re.compile(r"\b([A-Z]{2})\s+(\d{5}(?:-\d{4})?)\b")
LINE_START_RE = re.compile(
    r"^\s*(\d{1,4}|[A-Z]?\d{3,4})\s+(.+?)\s+([0-9]+(?:\.[0-9]+)?)\s+([A-Z]{1,4})\s+\$?([0-9,]+\.[0-9]{2})(?:\s+\$?([0-9,]+\.[0-9]{2}))?\s*$"
)


def parse_extracted(extracted: ExtractedPdf) -> PurchaseOrder:
    text = extracted.text
    if not text.strip():
        raise ValueError(f"{extracted.path.name} has no extractable text (scanned PDF?)")

    fields: dict[str, str] = {}
    confidence: dict[str, Confidence] = {}
    warnings: list[str] = []

    for name, patterns in LABEL_PATTERNS.items():
        value = _first_match(text, patterns)
        if value:
            fields[name] = value.strip()
            confidence[name] = Confidence.HIGH

    if "po_number" not in fields:
        va_numbers = VA_PO_RE.findall(text)
        if len(set(va_numbers)) == 1:
            fields["po_number"] = va_numbers[0]
            confidence["po_number"] = Confidence.MEDIUM
            warnings.append("PO number inferred from a single VA document number")
        elif len(set(va_numbers)) > 1:
            warnings.append(
                "Multiple VA-style document numbers found; PO number left blank for review"
            )

    form_type = _detect_form(text)
    ship_to = _parse_address_block(text, ("SHIP TO", "6. SHIP TO", "CONSIGNEE", "DELIVER TO"))
    if ship_to and ship_to.is_usable():
        confidence["ship_to"] = Confidence.HIGH
    else:
        warnings.append("Ship-to address was not clearly labeled")

    issuing = _parse_address_block(text, ("ISSUING OFFICE", "ISSUED BY", "5. ISSUING"))
    customer_name = None
    if ship_to and ship_to.name:
        customer_name = ship_to.name
        confidence["customer_name"] = Confidence.HIGH
    elif issuing and issuing.name:
        customer_name = issuing.name
        confidence["customer_name"] = Confidence.MEDIUM

    line_items = _parse_line_items(text, extracted.tables)
    if not line_items:
        warnings.append("No line items could be parsed from text or tables")

    total = _parse_total(text)
    if total is not None:
        confidence["total_amount"] = Confidence.HIGH
        line_total = sum((item.amount or Decimal("0")) for item in line_items)
        if line_items and line_total and abs(line_total - total) > Decimal("0.05"):
            warnings.append(
                f"Line amounts ({line_total}) do not add up to document total ({total})"
            )

    po_number = fields.get("po_number", "").strip()
    return PurchaseOrder(
        po_number=po_number,
        contract_number=fields.get("contract_number"),
        requisition_number=fields.get("requisition_number"),
        order_date=_normalize_date(fields.get("order_date")),
        delivery_date=_normalize_date(fields.get("delivery_date")),
        issuing_office=issuing.formatted() if issuing else None,
        contractor=_labeled_block(text, ("CONTRACTOR", "17A. CONTRACTOR", "VENDOR")),
        ship_to=ship_to,
        customer_name=customer_name,
        station_number=fields.get("station_number"),
        dodac=fields.get("dodac"),
        contact_name=fields.get("contact_name"),
        contact_email=fields.get("contact_email"),
        contact_phone=fields.get("contact_phone"),
        line_items=line_items,
        total_amount=total,
        source_path=extracted.path,
        source_text=text,
        form_type=form_type,
        field_confidence=confidence,
        warnings=warnings,
    )


def _detect_form(text: str) -> str | None:
    upper = text.upper()
    if "STANDARD FORM 1449" in upper or "SF 1449" in upper:
        return "SF1449"
    if "OPTIONAL FORM 347" in upper or "OF 347" in upper or "ORDER FOR SUPPLIES OR SERVICES" in upper:
        return "OF347"
    if "PURCHASE ORDER" in upper:
        return "PURCHASE_ORDER"
    return None


def _first_match(text: str, patterns: Iterable[re.Pattern[str]]) -> str | None:
    for pattern in patterns:
        match = pattern.search(text)
        if match:
            return match.group(1).strip(" .#:")
    return None


def _labeled_block(text: str, labels: tuple[str, ...]) -> str | None:
    lines = text.splitlines()
    for index, line in enumerate(lines):
        upper = line.upper()
        if any(label in upper for label in labels):
            remainder = re.sub(r"(?i)^.*?(?:contractor|vendor|issuing office|issued by)\s*[:#]?", "", line).strip()
            collected = [remainder] if remainder and not remainder.endswith(":") else []
            for following in lines[index + 1 : index + 5]:
                if _looks_like_new_section(following):
                    break
                if following.strip():
                    collected.append(following.strip())
            joined = " ".join(collected).strip(" :")
            return joined or None
    return None


def _parse_address_block(text: str, labels: tuple[str, ...]) -> Address | None:
    lines = text.splitlines()
    for index, line in enumerate(lines):
        if not any(label in line.upper() for label in labels):
            continue
        block: list[str] = []
        remainder = re.split(
            r"(?i)ship to|consignee|deliver to|issuing office|issued by",
            line,
            maxsplit=1,
        )
        if len(remainder) == 2 and remainder[1].strip(" :"):
            block.append(remainder[1].strip(" :"))
        for following in lines[index + 1 : index + 10]:
            if _looks_like_new_section(following):
                break
            cleaned = _strip_address_label(following)
            if cleaned:
                block.append(cleaned)
        return _address_from_lines(block)
    return None


def _strip_address_label(line: str) -> str:
    cleaned = line.strip()
    cleaned = re.sub(
        r"(?i)^(a\.|b\.|c\.|d\.|e\.|f\.)\s*"
        r"(name of consignee|street address|city|state|zip(?:\s*code)?|name)?\s*",
        "",
        cleaned,
    )
    return cleaned.strip(" :")


def _address_from_lines(lines: list[str]) -> Address | None:
    useful = [re.sub(r"\s+", " ", line).strip(" ,") for line in lines if line.strip()]
    useful = [line for line in useful if _keep_address_line(line)]
    if not useful:
        return None

    name = None
    street_lines: list[str] = []
    city = state = zip_code = None
    for candidate in useful:
        match = STATE_RE.search(candidate)
        if match:
            state, zip_code = match.group(1), match.group(2)
            maybe_city = re.sub(
                r",?\s*[A-Z]{2}\s+\d{5}(?:-\d{4})?$", "", candidate
            ).strip(" ,")
            if maybe_city:
                city = maybe_city
            continue
        if re.fullmatch(r"\d{5}(?:-\d{4})?", candidate):
            zip_code = candidate
            continue
        if re.fullmatch(r"[A-Z]{2}", candidate):
            state = candidate
            continue
        if name is None:
            name = candidate
            continue
        if re.search(r"\d", candidate):
            street_lines.append(candidate)
            continue
        if city is None:
            city = candidate

    line1 = street_lines[0] if street_lines else None
    line2 = street_lines[1] if len(street_lines) > 1 else None
    return Address(
        name=name,
        line1=line1,
        line2=line2,
        city=city,
        state=state,
        zip_code=zip_code,
        raw="; ".join(useful),
    )


def _keep_address_line(line: str) -> bool:
    if not line:
        return False
    if re.search(r"\d", line) or STATE_RE.search(line):
        return True
    if "VA" in line.upper() or "VETERANS" in line.upper() or "MEDICAL" in line.upper():
        return True
    if re.fullmatch(r"[A-Za-z .'-]+", line) and len(line.split()) <= 4:
        return True
    return False


def _looks_like_new_section(line: str) -> bool:
    upper = line.strip().upper()
    if not upper:
        return False
    return bool(
        re.match(
            r"^(ITEM|SCHEDULE|QUANTITY|UNIT PRICE|AMOUNT|MAIL INVOICE|ACCOUNTING|"
            r"TYPE OF ORDER|FOB|DISCOUNT|CONTRACTOR|BILL TO|SHIP VIA|PAGE |"
            r"STATION|DODAAC|SHIP TO DODAAC|CONTRACTING|ORDERING|PHONE|"
            r"TELEPHONE|EMAIL|ATTN|TOTAL)\b",
            upper,
        )
    )


def _parse_line_items(text: str, tables: list[list[list[str]]]) -> list[LineItem]:
    from_tables = _lines_from_tables(tables)
    if from_tables:
        return from_tables
    return _lines_from_text(text)


def _lines_from_tables(tables: list[list[list[str]]]) -> list[LineItem]:
    items: list[LineItem] = []
    for table in tables:
        header_index = _header_row_index(table)
        if header_index is None:
            continue
        header = [cell.casefold() for cell in table[header_index]]
        for row in table[header_index + 1 :]:
            item = _line_from_row(header, row)
            if item:
                items.append(item)
    return items


def _header_row_index(table: list[list[str]]) -> int | None:
    for index, row in enumerate(table):
        joined = " ".join(cell.casefold() for cell in row)
        if "qty" in joined or "quantity" in joined:
            if "item" in joined or "description" in joined or "supplies" in joined:
                return index
    return None


def _line_from_row(header: list[str], row: list[str]) -> LineItem | None:
    cells = {header[i] if i < len(header) else f"col{i}": row[i] if i < len(row) else "" for i in range(max(len(header), len(row)))}
    description = _cell(cells, ("schedule", "supplies", "description", "item description", "supplies/services"))
    quantity_text = _cell(cells, ("qty", "quantity", "order qty"))
    if not description or not quantity_text:
        return None
    quantity = _decimal(quantity_text)
    if quantity is None or quantity <= 0:
        return None
    unit_price = _decimal(_cell(cells, ("unit price", "price", "unit cost")))
    amount = _decimal(_cell(cells, ("amount", "extended", "total")))
    if amount is None and unit_price is not None:
        amount = (quantity * unit_price).quantize(Decimal("0.01"))
    sku = _cell(cells, ("sku", "part", "part no", "part number", "catalog", "mfr part"))
    nsn = _cell(cells, ("nsn", "national stock"))
    return LineItem(
        line_number=_cell(cells, ("item", "item no", "item number", "line", "clin")),
        description=description,
        quantity=quantity,
        unit=_cell(cells, ("unit", "u/i", "ui")),
        unit_price=unit_price,
        amount=amount,
        sku=sku or None,
        nsn=nsn or None,
        raw_text=" | ".join(row),
        confidence=Confidence.HIGH,
    )


def _cell(cells: dict[str, str], names: tuple[str, ...]) -> str:
    for key, value in cells.items():
        if any(name in key for name in names):
            return value.strip()
    return ""


def _lines_from_text(text: str) -> list[LineItem]:
    items: list[LineItem] = []
    for line in text.splitlines():
        match = LINE_START_RE.match(line)
        if not match:
            continue
        quantity = _decimal(match.group(3))
        unit_price = _decimal(match.group(5))
        amount = _decimal(match.group(6)) if match.group(6) else None
        if quantity is None:
            continue
        if amount is None and unit_price is not None:
            amount = (quantity * unit_price).quantize(Decimal("0.01"))
        items.append(
            LineItem(
                line_number=match.group(1),
                description=match.group(2).strip(" -"),
                quantity=quantity,
                unit=match.group(4),
                unit_price=unit_price,
                amount=amount,
                raw_text=line.strip(),
                confidence=Confidence.MEDIUM,
            )
        )
    return items


def _parse_total(text: str) -> Decimal | None:
    patterns = [
        re.compile(r"(?i)\b(?:total\s*award\s*amount|grand\s*total|order\s*total|total\s*amount)\s*[:#]?\s*\$?\s*([0-9,]+\.[0-9]{2})"),
        re.compile(r"(?i)\btotal\s*\$?\s*([0-9,]+\.[0-9]{2})\s*$", re.M),
    ]
    for pattern in patterns:
        match = pattern.search(text)
        if match:
            return _decimal(match.group(1))
    return None


def _decimal(value: str | None) -> Decimal | None:
    if not value:
        return None
    cleaned = value.strip().replace("$", "").replace(",", "")
    try:
        return Decimal(cleaned)
    except InvalidOperation:
        return None


def _normalize_date(value: str | None) -> str | None:
    if not value:
        return None
    for fmt, out in (
        (r"^(\d{1,2})/(\d{1,2})/(\d{4})$", "{2:04d}-{0:02d}-{1:02d}"),
        (r"^(\d{1,2})-(\d{1,2})-(\d{4})$", "{2:04d}-{0:02d}-{1:02d}"),
        (r"^(\d{1,2})/(\d{1,2})/(\d{2})$", None),
        (r"^(\d{4})-(\d{2})-(\d{2})$", "{0}-{1}-{2}"),
    ):
        match = re.match(fmt, value)
        if not match:
            continue
        parts = [int(group) for group in match.groups()]
        if len(parts) == 3 and parts[2] < 100:
            year = 2000 + parts[2] if parts[2] < 70 else 1900 + parts[2]
            return f"{year:04d}-{parts[0]:02d}-{parts[1]:02d}"
        if out == "{0}-{1}-{2}":
            return f"{parts[0]:04d}-{parts[1]:02d}-{parts[2]:02d}"
        return f"{parts[2]:04d}-{parts[0]:02d}-{parts[1]:02d}"
    return value
