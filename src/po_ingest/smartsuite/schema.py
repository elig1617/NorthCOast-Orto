"""Resolve mapping.yaml names to live SmartSuite table IDs and field slugs."""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any

from po_ingest.config import MappingConfig, TableMap
from po_ingest.smartsuite.client import SmartSuiteClient, SmartSuiteError


@dataclass
class ResolvedField:
    slug: str
    label: str
    field_type: str
    required: bool
    params: dict[str, Any]


@dataclass
class ResolvedTable:
    key: str
    name: str
    id: str
    primary_field: str
    fields: dict[str, ResolvedField]
    mapped: dict[str, ResolvedField] = field(default_factory=dict)

    def field(self, logical_name: str) -> ResolvedField | None:
        return self.mapped.get(logical_name)

    def require_field(self, logical_name: str) -> ResolvedField:
        resolved = self.field(logical_name)
        if resolved is None:
            raise SmartSuiteError(
                f"Table {self.name!r} has no mapping for {logical_name!r}. "
                "Update config/mapping.yaml after running `po-ingest discover`."
            )
        return resolved


@dataclass
class ResolvedSchema:
    tables: dict[str, ResolvedTable]

    def table(self, key: str) -> ResolvedTable:
        return self.tables[key]


def resolve_schema(client: SmartSuiteClient, mapping: MappingConfig) -> ResolvedSchema:
    tables = client.list_tables()
    by_id = {item["id"]: item for item in tables}
    by_name = {_norm(item.get("name", "")): item for item in tables}
    resolved: dict[str, ResolvedTable] = {}
    for key, table_map in mapping.all_tables().items():
        raw = _find_table(table_map, by_id, by_name)
        if raw is None:
            raise SmartSuiteError(
                f"Could not find SmartSuite table {table_map.name!r} "
                f"(id={table_map.id!r}). Run `po-ingest discover` and update mapping.yaml."
            )
        structure = raw.get("structure") or []
        fields = {
            item["slug"]: ResolvedField(
                slug=item["slug"],
                label=item.get("label") or item["slug"],
                field_type=item.get("field_type") or "",
                required=bool((item.get("params") or {}).get("required")),
                params=item.get("params") or {},
            )
            for item in structure
        }
        mapped = _map_fields(table_map, fields)
        resolved[key] = ResolvedTable(
            key=key,
            name=raw.get("name") or table_map.name,
            id=raw["id"],
            primary_field=raw.get("primary_field") or "title",
            fields=fields,
            mapped=mapped,
        )
    return ResolvedSchema(tables=resolved)


def dump_schema(client: SmartSuiteClient) -> list[dict[str, Any]]:
    """Human-readable workspace dump used by `po-ingest discover`."""
    dump: list[dict[str, Any]] = []
    for table in client.list_tables():
        fields = []
        for item in table.get("structure") or []:
            params = item.get("params") or {}
            fields.append(
                {
                    "label": item.get("label"),
                    "slug": item.get("slug"),
                    "type": item.get("field_type"),
                    "required": bool(params.get("required")),
                    "linked_application": params.get("linked_application"),
                    "choices": [
                        {"value": choice.get("value"), "label": choice.get("label")}
                        for choice in params.get("choices") or []
                    ]
                    or None,
                }
            )
        dump.append(
            {
                "name": table.get("name"),
                "id": table.get("id"),
                "solution": table.get("solution"),
                "primary_field": table.get("primary_field"),
                "fields": fields,
            }
        )
    return dump


def _find_table(
    table_map: TableMap,
    by_id: dict[str, dict[str, Any]],
    by_name: dict[str, dict[str, Any]],
) -> dict[str, Any] | None:
    if table_map.id:
        return by_id.get(table_map.id)
    return by_name.get(_norm(table_map.name))


def _map_fields(
    table_map: TableMap, fields: dict[str, ResolvedField]
) -> dict[str, ResolvedField]:
    by_slug = fields
    by_label = {_norm(field.label): field for field in fields.values()}
    mapped: dict[str, ResolvedField] = {}
    for logical, configured in table_map.fields.all().items():
        if not configured:
            continue
        field = by_slug.get(configured) or by_label.get(_norm(configured))
        if field is None:
            raise SmartSuiteError(
                f"Field {configured!r} not found on table {table_map.name!r}."
            )
        mapped[logical] = field
    return mapped


def _norm(value: str) -> str:
    return " ".join(value.casefold().split())
