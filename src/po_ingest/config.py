"""Load mapping YAML and SmartSuite credentials."""

from __future__ import annotations

from pathlib import Path
from typing import Any

import yaml
from pydantic import BaseModel, Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class FieldMap(BaseModel):
    """Human label or slug → SmartSuite field slug, resolved at runtime."""

    title: str = "title"
    extras: dict[str, str] = Field(default_factory=dict)

    def all(self) -> dict[str, str]:
        merged = {"title": self.title}
        merged.update(self.extras)
        return merged

    @classmethod
    def from_mapping(cls, data: dict[str, Any] | None) -> FieldMap:
        data = dict(data or {})
        title = data.pop("title", "title")
        return cls(title=title, extras=data)


class TableMap(BaseModel):
    name: str
    id: str | None = None
    fields: FieldMap = Field(default_factory=FieldMap)
    match_fields: list[str] = Field(default_factory=list)
    customer_link: str | None = None
    status_slug: str | None = None
    status_value: str | None = None

    @classmethod
    def from_mapping(cls, data: dict[str, Any]) -> TableMap:
        payload = dict(data)
        fields = FieldMap.from_mapping(payload.pop("fields", {}))
        status = payload.pop("status", None) or {}
        return cls(
            name=payload.pop("name"),
            id=payload.pop("id", None),
            fields=fields,
            match_fields=payload.pop("match_fields", []) or [],
            customer_link=payload.pop("customer_link", None),
            status_slug=status.get("slug"),
            status_value=status.get("new_order_value"),
        )


class MatchingConfig(BaseModel):
    min_score: float = 92.0
    unique_margin: float = 8.0
    product_min_score: float = 94.0


class MappingConfig(BaseModel):
    inbox_dir: Path = Path("data/inbox")
    processing_dir: Path = Path("data/processing")
    review_dir: Path = Path("data/review")
    processed_dir: Path = Path("data/processed")
    failed_dir: Path = Path("data/failed")
    audit_dir: Path = Path("data/audit")
    matching: MatchingConfig = Field(default_factory=MatchingConfig)
    orders: TableMap
    order_lines: TableMap
    customers: TableMap
    contacts: TableMap
    products: TableMap

    def all_tables(self) -> dict[str, TableMap]:
        return {
            "orders": self.orders,
            "order_lines": self.order_lines,
            "customers": self.customers,
            "contacts": self.contacts,
            "products": self.products,
        }


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    smartsuite_api_key: str = ""
    smartsuite_workspace_id: str = ""
    smartsuite_base_url: str = "https://app.smartsuite.com/api/v1"
    po_ingest_mapping: Path = Path("config/mapping.yaml")


def load_mapping(path: Path | None = None) -> MappingConfig:
    settings = Settings()
    mapping_path = path or settings.po_ingest_mapping
    if not mapping_path.exists():
        raise FileNotFoundError(
            f"Mapping file not found: {mapping_path}. Copy config/mapping.example.yaml "
            "and fill in table/field names from `po-ingest discover`."
        )
    raw = yaml.safe_load(mapping_path.read_text()) or {}
    tables = raw.get("tables") or {}
    required = ("orders", "order_lines", "customers", "contacts", "products")
    missing = [name for name in required if name not in tables]
    if missing:
        raise ValueError(f"mapping.yaml is missing tables: {', '.join(missing)}")
    return MappingConfig(
        inbox_dir=Path(raw.get("inbox_dir", "data/inbox")),
        processing_dir=Path(raw.get("processing_dir", "data/processing")),
        review_dir=Path(raw.get("review_dir", "data/review")),
        processed_dir=Path(raw.get("processed_dir", "data/processed")),
        failed_dir=Path(raw.get("failed_dir", "data/failed")),
        audit_dir=Path(raw.get("audit_dir", "data/audit")),
        matching=MatchingConfig(**(raw.get("matching") or {})),
        orders=TableMap.from_mapping(tables["orders"]),
        order_lines=TableMap.from_mapping(tables["order_lines"]),
        customers=TableMap.from_mapping(tables["customers"]),
        contacts=TableMap.from_mapping(tables["contacts"]),
        products=TableMap.from_mapping(tables["products"]),
    )


def load_settings() -> Settings:
    return Settings()
