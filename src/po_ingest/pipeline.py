"""End-to-end ingest: extract → parse → match → (optional) write → confirm → file."""

from __future__ import annotations

from pathlib import Path

from po_ingest.config import MappingConfig, load_mapping, load_settings
from po_ingest.filing import claim_pdf, file_result
from po_ingest.matching import prepare_order
from po_ingest.models import IngestDecision, IngestResult, PurchaseOrder
from po_ingest.pdf_extract import extract_pdf
from po_ingest.smartsuite.client import SmartSuiteClient
from po_ingest.smartsuite.schema import resolve_schema
from po_ingest.va_po_parser import parse_extracted
from po_ingest.writer import commit_order, find_existing_order


def process_inbox(
    *,
    mapping: MappingConfig | None = None,
    inbox: Path | None = None,
    commit: bool = False,
    client: SmartSuiteClient | None = None,
) -> list[IngestResult]:
    mapping = mapping or load_mapping()
    inbox_dir = inbox or mapping.inbox_dir
    pdfs = sorted(
        path
        for path in inbox_dir.glob("*")
        if path.is_file() and path.suffix.lower() == ".pdf"
    )
    return [process_pdf(path, mapping=mapping, commit=commit, client=client) for path in pdfs]


def process_pdf(
    path: Path,
    *,
    mapping: MappingConfig | None = None,
    commit: bool = False,
    client: SmartSuiteClient | None = None,
) -> IngestResult:
    mapping = mapping or load_mapping()
    claimed = claim_pdf(Path(path), mapping.processing_dir)
    owns_client = client is None
    try:
        if client is None:
            settings = load_settings()
            client = SmartSuiteClient(
                api_key=settings.smartsuite_api_key,
                workspace_id=settings.smartsuite_workspace_id,
                base_url=settings.smartsuite_base_url,
            )
        result = _run(claimed, mapping, commit, client)
    except Exception as exc:
        result = IngestResult(
            decision=IngestDecision.FAILED,
            pdf_path=claimed,
            message=str(exc),
        )
    finally:
        if owns_client and client is not None:
            client.close()
    return file_result(
        result,
        processed_dir=mapping.processed_dir,
        review_dir=mapping.review_dir,
        failed_dir=mapping.failed_dir,
        audit_dir=mapping.audit_dir,
    )


def _run(
    path: Path,
    mapping: MappingConfig,
    commit: bool,
    client: SmartSuiteClient,
) -> IngestResult:
    extracted = extract_pdf(path)
    purchase_order = parse_extracted(extracted)
    schema = resolve_schema(client, mapping)

    existing = None
    if purchase_order.po_number:
        existing = find_existing_order(client, schema, purchase_order)
    if existing:
        return IngestResult(
            decision=IngestDecision.SKIPPED,
            pdf_path=path,
            purchase_order=purchase_order,
            message=(
                f"PO {purchase_order.po_number} already exists as SmartSuite record "
                f"{existing.get('id')}. PDF sent to review/skipped."
            ),
        )

    prepared = prepare_order(client, schema, mapping, purchase_order)
    if purchase_order.critical_gaps() or not prepared.can_commit():
        return IngestResult(
            decision=IngestDecision.REVIEW,
            pdf_path=path,
            purchase_order=purchase_order,
            prepared=prepared,
            message=_review_message(purchase_order, prepared),
        )

    if not commit:
        return IngestResult(
            decision=IngestDecision.DRY_RUN,
            pdf_path=path,
            purchase_order=purchase_order,
            prepared=prepared,
            message=(
                f"PO {purchase_order.po_number} is ready to write "
                f"({len(prepared.lines)} line(s), customer "
                f"{prepared.customer.candidate.title if prepared.customer.candidate else '?'}). "
                "Re-run with --commit to create the SmartSuite records."
            ),
        )

    written = commit_order(client, schema, mapping, prepared, path)
    if not written.confirmed():
        return IngestResult(
            decision=IngestDecision.FAILED,
            pdf_path=path,
            purchase_order=purchase_order,
            prepared=prepared,
            written=written,
            message=(
                f"Wrote order {written.order_id} but confirmation failed: "
                + "; ".join(
                    f"{issue.field}: expected {issue.expected}, got {issue.actual}"
                    for issue in written.issues
                )
            ),
        )
    return IngestResult(
        decision=IngestDecision.COMMITTED,
        pdf_path=path,
        purchase_order=purchase_order,
        prepared=prepared,
        written=written,
        message=(
            f"Created order {written.order_id} with {len(written.line_ids)} line(s). "
            f"{written.order_url or ''}"
        ).strip(),
    )


def _review_message(purchase_order: PurchaseOrder, prepared) -> str:
    reasons = prepared.blockers or ["needs review"]
    return (
        f"PO {purchase_order.po_number or '(unknown)'} held for review: "
        + "; ".join(reasons)
    )
