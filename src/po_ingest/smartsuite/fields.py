"""Encode Python values into SmartSuite field payloads and compare them on read-back."""

from __future__ import annotations

import re
from datetime import date, datetime
from decimal import Decimal
from typing import Any

from po_ingest.models import Address


READ_ONLY_TYPES = {
    "autonumberfield",
    "countfield",
    "firstcreatedfield",
    "formulafield",
    "lastupdatedfield",
    "recordidfield",
    "rollupfield",
    "votefield",
    "lookupfield",
    "commentscountfield",
}


def encode_field(field_type: str, value: Any) -> Any:
    """Convert a native value into the JSON shape SmartSuite expects for `field_type`."""
    if value is None:
        return None
    encoder = {
        "textfield": _as_text,
        "textareafield": _as_text,
        "recordtitlefield": _as_text,
        "numberfield": _as_number_string,
        "currencyfield": _as_number_string,
        "percentfield": _as_number_string,
        "datefield": _as_date,
        "duedatefield": _as_due_date,
        "daterangefield": _as_date_range,
        "linkedrecordfield": _as_linked_ids,
        "addressfield": _as_address,
        "emailfield": _as_string_list,
        "phonefield": _as_phone,
        "yesnofield": bool,
        "statusfield": _as_status,
        "singleselectfield": _as_text,
        "multipleselectfield": _as_string_list,
    }.get(field_type)
    if encoder is None:
        return value
    return encoder(value)


def verify_field(field_type: str, expected: Any, actual: Any) -> bool:
    """Return True when the value written to SmartSuite matches the read-back."""
    if expected is None:
        return True
    encoded = encode_field(field_type, expected)
    if field_type in {"numberfield", "currencyfield", "percentfield"}:
        return _numbers_equal(encoded, actual)
    if field_type == "linkedrecordfield":
        return _id_lists_equal(encoded, actual)
    if field_type == "datefield":
        return _dates_equal(encoded, actual)
    if field_type == "addressfield":
        return _addresses_equal(encoded, actual)
    if field_type in {"textfield", "textareafield", "recordtitlefield"}:
        return _normalize_text(encoded) == _normalize_text(actual)
    if field_type == "statusfield":
        actual_value = actual.get("value") if isinstance(actual, dict) else actual
        expected_value = encoded.get("value") if isinstance(encoded, dict) else encoded
        return str(actual_value) == str(expected_value)
    return encoded == actual


def _as_text(value: Any) -> str:
    return str(value).strip()


def _as_number_string(value: Any) -> str:
    if isinstance(value, Decimal):
        text = format(value, "f")
    else:
        text = str(value).strip().replace(",", "")
        text = text.replace("$", "")
    if text.endswith(".0") and "." in text:
        # Keep a single decimal for currency-looking values; otherwise strip trailing .0
        pass
    return text


def _as_date(value: Any) -> dict[str, Any]:
    iso = _to_iso_date(value)
    return {"date": iso, "include_time": False}


def _as_due_date(value: Any) -> dict[str, Any]:
    iso = _to_iso_date(value)
    return {
        "from_date": {"date": None, "include_time": False},
        "to_date": {"date": iso, "include_time": False},
    }


def _as_date_range(value: Any) -> dict[str, Any]:
    if isinstance(value, dict) and "from_date" in value:
        return value
    iso = _to_iso_date(value)
    return {
        "from_date": {"date": iso, "include_time": False},
        "to_date": {"date": iso, "include_time": False},
    }


def _as_linked_ids(value: Any) -> list[str]:
    if value is None:
        return []
    if isinstance(value, str):
        return [value]
    return [str(item) for item in value]


def _as_address(value: Any) -> dict[str, Any]:
    if isinstance(value, Address):
        address = value
    elif isinstance(value, dict):
        address = Address.model_validate(value)
    else:
        address = Address(raw=str(value), line1=str(value))
    payload = {
        "location_address": address.line1 or "",
        "location_address2": address.line2 or "",
        "location_city": address.city or "",
        "location_state": address.state or "",
        "location_zip": address.zip_code or "",
        "location_country": address.country or "United States",
        "sys_root": address.formatted(),
    }
    return payload


def _as_string_list(value: Any) -> list[str]:
    if value is None:
        return []
    if isinstance(value, str):
        return [value]
    return [str(item) for item in value]


def _as_phone(value: Any) -> list[dict[str, Any]]:
    number = str(value)
    digits = re.sub(r"\D", "", number)
    return [
        {
            "phone_country": "US",
            "phone_number": number,
            "phone_extension": "",
            "phone_type": 1,
            "sys_root": digits,
        }
    ]


def _as_status(value: Any) -> dict[str, Any]:
    if isinstance(value, dict):
        return value
    return {"value": str(value)}


def _to_iso_date(value: Any) -> str:
    if isinstance(value, datetime):
        return value.date().isoformat() + "T00:00:00Z"
    if isinstance(value, date):
        return value.isoformat() + "T00:00:00Z"
    text = str(value).strip()
    for fmt in ("%Y-%m-%d", "%m/%d/%Y", "%m-%d-%Y", "%Y/%m/%d"):
        try:
            parsed = datetime.strptime(text, fmt)
            return parsed.date().isoformat() + "T00:00:00Z"
        except ValueError:
            continue
    if re.match(r"^\d{4}-\d{2}-\d{2}T", text):
        return text if text.endswith("Z") else text + "Z"
    raise ValueError(f"unrecognized date: {value!r}")


def _numbers_equal(expected: Any, actual: Any) -> bool:
    try:
        return Decimal(str(expected).replace(",", "")) == Decimal(
            str(actual).replace(",", "")
        )
    except Exception:
        return str(expected) == str(actual)


def _id_lists_equal(expected: Any, actual: Any) -> bool:
    left = [str(item) for item in (expected or [])]
    right = [str(item) for item in (actual or [])]
    return left == right


def _dates_equal(expected: Any, actual: Any) -> bool:
    expected_date = expected.get("date") if isinstance(expected, dict) else expected
    actual_date = actual.get("date") if isinstance(actual, dict) else actual
    if not expected_date or not actual_date:
        return False
    return str(expected_date)[:10] == str(actual_date)[:10]


def _addresses_equal(expected: Any, actual: Any) -> bool:
    if not isinstance(expected, dict) or not isinstance(actual, dict):
        return False
    keys = (
        "location_address",
        "location_city",
        "location_state",
        "location_zip",
    )
    for key in keys:
        left = _normalize_text(expected.get(key, ""))
        right = _normalize_text(actual.get(key, ""))
        if left and right and left != right:
            return False
        if left and not right:
            return False
    return True


def _normalize_text(value: Any) -> str:
    return re.sub(r"\s+", " ", str(value or "")).strip().casefold()
