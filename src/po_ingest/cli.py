"""Command-line interface for VA PO ingest."""

from __future__ import annotations

import json
from pathlib import Path

import click
import yaml

from po_ingest.config import load_mapping, load_settings
from po_ingest.pipeline import process_inbox, process_pdf
from po_ingest.smartsuite.client import SmartSuiteClient
from po_ingest.smartsuite.schema import dump_schema


@click.group()
def main() -> None:
    """Ingest VA purchase-order PDFs into SmartSuite."""


@main.command("discover")
@click.option("--out", type=click.Path(path_type=Path), default=None, help="Write JSON dump here")
def discover(out: Path | None) -> None:
    """List SmartSuite tables and field slugs so mapping.yaml can be filled in."""
    client = _client()
    try:
        schema = dump_schema(client)
    finally:
        client.close()
    text = json.dumps(schema, indent=2)
    if out:
        out.write_text(text)
        click.echo(f"Wrote {out}")
    else:
        click.echo(text)


@main.command("process")
@click.option("--inbox", type=click.Path(path_type=Path, exists=True, file_okay=False), default=None)
@click.option(
    "--commit",
    is_flag=True,
    help="Create SmartSuite records. Without this flag the run is a dry-run.",
)
@click.option("--mapping", type=click.Path(path_type=Path, exists=True, dir_okay=False), default=None)
def process(inbox: Path | None, commit: bool, mapping: Path | None) -> None:
    """Process every PDF in the inbox folder."""
    loaded = load_mapping(mapping) if mapping else load_mapping()
    results = process_inbox(mapping=loaded, inbox=inbox, commit=commit)
    if not results:
        click.echo("No PDFs in inbox.")
        return
    for result in results:
        click.echo(f"[{result.decision.value}] {result.message}")
        if result.filed_path:
            click.echo(f"  filed: {result.filed_path}")
        if result.audit_path:
            click.echo(f"  audit: {result.audit_path}")


@main.command("process-one")
@click.argument("pdf", type=click.Path(path_type=Path, exists=True, dir_okay=False))
@click.option("--commit", is_flag=True)
@click.option("--mapping", type=click.Path(path_type=Path, exists=True, dir_okay=False), default=None)
def process_one(pdf: Path, commit: bool, mapping: Path | None) -> None:
    """Process a single PDF."""
    loaded = load_mapping(mapping) if mapping else load_mapping()
    result = process_pdf(pdf, mapping=loaded, commit=commit)
    click.echo(f"[{result.decision.value}] {result.message}")
    if result.filed_path:
        click.echo(f"  filed: {result.filed_path}")
    if result.audit_path:
        click.echo(f"  audit: {result.audit_path}")


@main.command("print-mapping")
def print_mapping() -> None:
    """Show the loaded mapping file after validation."""
    mapping = load_mapping()
    click.echo(yaml.safe_dump(json.loads(mapping.model_dump_json()), sort_keys=False))


def _client() -> SmartSuiteClient:
    settings = load_settings()
    return SmartSuiteClient(
        api_key=settings.smartsuite_api_key,
        workspace_id=settings.smartsuite_workspace_id,
        base_url=settings.smartsuite_base_url,
    )
