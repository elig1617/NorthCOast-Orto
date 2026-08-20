"""Canonical models for a parsed VA purchase order and ingest outcomes."""

from __future__ import annotations

from decimal import Decimal
from enum import Enum
from pathlib import Path
from typing import Any

from pydantic import BaseModel, Field, field_validator


class Confidence(str, Enum):
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"


class Address(BaseModel):
    name: str | None = None
    line1: str | None = None
    line2: str | None = None
    city: str | None = None
    state: str | None = None
    zip_code: str | None = None
    country: str = "United States"
    raw: str | None = None

    def formatted(self) -> str:
        parts = [
            self.name,
            self.line1,
            self.line2,
            ", ".join(p for p in (self.city, self.state) if p),
            self.zip_code,
            self.country,
        ]
        return ", ".join(p for p in parts if p)

    def is_usable(self) -> bool:
        return bool(self.line1 or self.city or self.raw)


class LineItem(BaseModel):
    line_number: str | None = None
    description: str
    quantity: Decimal
    unit: str | None = None
    unit_price: Decimal | None = None
    amount: Decimal | None = None
    sku: str | None = None
    nsn: str | None = None
    manufacturer_part: str | None = None
    raw_text: str | None = None
    confidence: Confidence = Confidence.MEDIUM

    @field_validator("quantity")
    @classmethod
    def quantity_must_be_positive(cls, value: Decimal) -> Decimal:
        if value <= 0:
            raise ValueError("quantity must be greater than zero")
        return value


class PurchaseOrder(BaseModel):
    po_number: str
    contract_number: str | None = None
    requisition_number: str | None = None
    order_date: str | None = None
    delivery_date: str | None = None
    issuing_office: str | None = None
    contractor: str | None = None
    ship_to: Address | None = None
    bill_to: Address | None = None
    customer_name: str | None = None
    station_number: str | None = None
    dodac: str | None = None
    contact_name: str | None = None
    contact_email: str | None = None
    contact_phone: str | None = None
    line_items: list[LineItem] = Field(default_factory=list)
    total_amount: Decimal | None = None
    source_path: Path | None = None
    source_text: str = ""
    form_type: str | None = None
    field_confidence: dict[str, Confidence] = Field(default_factory=dict)
    warnings: list[str] = Field(default_factory=list)

    def critical_gaps(self) -> list[str]:
        gaps: list[str] = []
        if not self.po_number.strip():
            gaps.append("po_number")
        if not self.line_items:
            gaps.append("line_items")
        if self.ship_to is None or not self.ship_to.is_usable():
            gaps.append("ship_to")
        return gaps


class MatchCandidate(BaseModel):
    record_id: str
    title: str
    score: float
    matched_on: str
    record: dict[str, Any] = Field(default_factory=dict)


class EntityMatch(BaseModel):
    entity: str
    status: str
    candidate: MatchCandidate | None = None
    candidates: list[MatchCandidate] = Field(default_factory=list)
    query: str = ""
    reason: str = ""

    @property
    def is_unique(self) -> bool:
        return self.status == "matched" and self.candidate is not None


class LineMatch(BaseModel):
    line: LineItem
    product: EntityMatch


class PreparedOrder(BaseModel):
    purchase_order: PurchaseOrder
    customer: EntityMatch
    contact: EntityMatch
    lines: list[LineMatch]
    blockers: list[str] = Field(default_factory=list)

    def can_commit(self) -> bool:
        return not self.blockers


class VerificationIssue(BaseModel):
    field: str
    expected: str
    actual: str


class WrittenOrder(BaseModel):
    order_id: str
    order_url: str | None = None
    line_ids: list[str] = Field(default_factory=list)
    uploaded_pdf: bool = False
    issues: list[VerificationIssue] = Field(default_factory=list)

    def confirmed(self) -> bool:
        return not self.issues


class IngestDecision(str, Enum):
    DRY_RUN = "dry_run"
    COMMITTED = "committed"
    REVIEW = "review"
    SKIPPED = "skipped"
    FAILED = "failed"


class IngestResult(BaseModel):
    decision: IngestDecision
    pdf_path: Path
    filed_path: Path | None = None
    purchase_order: PurchaseOrder | None = None
    prepared: PreparedOrder | None = None
    written: WrittenOrder | None = None
    message: str
    audit_path: Path | None = None
