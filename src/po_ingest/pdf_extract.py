"""Pull text and table cells out of a purchase-order PDF."""

from __future__ import annotations

from dataclasses import dataclass, field
from pathlib import Path

import pdfplumber
from pypdf import PdfReader


@dataclass
class ExtractedPdf:
    path: Path
    text: str
    tables: list[list[list[str]]] = field(default_factory=list)
    page_count: int = 0


def extract_pdf(path: Path) -> ExtractedPdf:
    path = Path(path)
    text_parts: list[str] = []
    tables: list[list[list[str]]] = []
    page_count = 0

    with pdfplumber.open(path) as pdf:
        page_count = len(pdf.pages)
        for page in pdf.pages:
            page_text = page.extract_text() or ""
            if page_text.strip():
                text_parts.append(page_text)
            for table in page.extract_tables() or []:
                cleaned = [
                    ["" if cell is None else str(cell).strip() for cell in row]
                    for row in table
                    if any(cell and str(cell).strip() for cell in row)
                ]
                if cleaned:
                    tables.append(cleaned)

    if not any(part.strip() for part in text_parts):
        reader = PdfReader(str(path))
        page_count = len(reader.pages)
        for page in reader.pages:
            fallback = page.extract_text() or ""
            if fallback.strip():
                text_parts.append(fallback)

    return ExtractedPdf(
        path=path,
        text="\n".join(text_parts).strip(),
        tables=tables,
        page_count=page_count,
    )
