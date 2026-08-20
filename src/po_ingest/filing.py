"""Move PDFs through inbox → processing → processed / review / failed."""

from __future__ import annotations

import json
import shutil
from datetime import date
from pathlib import Path
from typing import Any

from po_ingest.models import IngestResult


SAFE_CHARS = "-_.() abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"


def ensure_folders(*paths: Path) -> None:
    for path in paths:
        path.mkdir(parents=True, exist_ok=True)


def claim_pdf(source: Path, processing_dir: Path) -> Path:
    processing_dir.mkdir(parents=True, exist_ok=True)
    destination = _unique_path(processing_dir / source.name)
    source.rename(destination)
    return destination


def file_result(
    result: IngestResult,
    *,
    processed_dir: Path,
    review_dir: Path,
    failed_dir: Path,
    audit_dir: Path,
) -> IngestResult:
    destination_root = {
        "committed": processed_dir,
        "dry_run": review_dir / "dry-run",
        "review": review_dir,
        "skipped": review_dir / "skipped",
        "failed": failed_dir,
    }[result.decision.value]
    dated = destination_root / date.today().isoformat()
    dated.mkdir(parents=True, exist_ok=True)
    stem = _safe_stem(result)
    filed = _unique_path(dated / f"{stem}{result.pdf_path.suffix.lower()}")
    shutil.move(str(result.pdf_path), filed)
    result.filed_path = filed

    audit_dir.mkdir(parents=True, exist_ok=True)
    audit_path = _unique_path(audit_dir / f"{stem}.json")
    audit_path.write_text(json.dumps(_audit_payload(result), indent=2, default=str))
    result.audit_path = audit_path
    return result


def restore_to_inbox(path: Path, inbox_dir: Path) -> Path:
    inbox_dir.mkdir(parents=True, exist_ok=True)
    destination = _unique_path(inbox_dir / path.name)
    shutil.move(str(path), destination)
    return destination


def _safe_stem(result: IngestResult) -> str:
    po_number = (
        result.purchase_order.po_number
        if result.purchase_order and result.purchase_order.po_number
        else result.pdf_path.stem
    )
    cleaned = "".join(char if char in SAFE_CHARS else "-" for char in po_number).strip()
    return cleaned or result.pdf_path.stem


def _unique_path(path: Path) -> Path:
    if not path.exists():
        return path
    index = 2
    while True:
        candidate = path.with_name(f"{path.stem}-{index}{path.suffix}")
        if not candidate.exists():
            return candidate
        index += 1


def _audit_payload(result: IngestResult) -> dict[str, Any]:
    payload: dict[str, Any] = {
        "decision": result.decision.value,
        "message": result.message,
        "source_pdf": str(result.pdf_path),
        "filed_pdf": str(result.filed_path) if result.filed_path else None,
    }
    if result.purchase_order:
        payload["purchase_order"] = result.purchase_order.model_dump(mode="json")
    if result.prepared:
        payload["blockers"] = result.prepared.blockers
        payload["customer"] = result.prepared.customer.model_dump(mode="json")
        payload["contact"] = result.prepared.contact.model_dump(mode="json")
        payload["lines"] = [
            {
                "description": item.line.description,
                "quantity": str(item.line.quantity),
                "product": item.product.model_dump(mode="json"),
            }
            for item in result.prepared.lines
        ]
    if result.written:
        payload["written"] = result.written.model_dump(mode="json")
    return payload
