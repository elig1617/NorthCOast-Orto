# North Coast Orthopedics — VA purchase-order ingest

Drop a VA PDF purchase order in a folder. This tool reads it, matches the
hospital / contact / products that already exist in SmartSuite, creates the
order and line items, reads the new records back to confirm they match the
PDF, then files the PDF away.

It will **not** invent a customer, contact, or product. If a match is missing
or ambiguous, the PDF goes to `data/review/` and nothing is written. Volume
is a handful to a couple dozen orders a week; accuracy is the constraint.

## How this writes into SmartSuite

There is no unofficial UI scrape. Writes go through the [SmartSuite REST API](https://developers.smartsuite.com/docs/solution-data/records/create-record).

Authentication (same privileges as the member who owns the key):

```
Authorization: Token <SMARTSUITE_API_KEY>
ACCOUNT-ID: <SMARTSUITE_WORKSPACE_ID>
```

The workspace ID is the 8 characters after `https://app.smartsuite.com/` in
the browser URL. The API key lives under **My Profile → API Key**.

| Step | Method | Endpoint |
| --- | --- | --- |
| Discover tables / field slugs | `GET` | `/api/v1/applications/` |
| Find customer, contact, product, existing PO | `POST` | `/api/v1/applications/{tableId}/records/list/` |
| Create the order | `POST` | `/api/v1/applications/{tableId}/records/` |
| Create line items (up to 25 per call) | `POST` | `/api/v1/applications/{tableId}/records/bulk/` |
| Attach the source PDF | `POST` | `/api/v1/recordfiles/{tableId}/{recordId}/{fieldSlug}/` |
| Confirm what was stored | `GET` | `/api/v1/applications/{tableId}/records/{recordId}/` |

Field values are encoded to SmartSuite’s types before POST:

- Linked records (account, contact, product, parent order) → `[recordId]`
- Quantity / currency → numeric strings (`"12"`, `"45.00"`)
- Dates → `{"date": "2026-08-15T00:00:00Z", "include_time": false}`
- Ship-to → `location_address`, `location_city`, `location_state`, `location_zip`

After create, the tool GETs the order and compares PO number, customer link,
contact link, ship-to, and line count. A mismatch is a **failed** ingest: the
PDF is filed under `data/failed/` and is not treated as done.

`--commit` is required to write. A normal run is a dry-run that shows the
proposed matches and files the PDF under `data/review/dry-run/`.

## Setup

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -e ".[dev]"
cp .env.example .env          # add SMARTSUITE_API_KEY and SMARTSUITE_WORKSPACE_ID
```

Map your SmartSuite apps (tables can be named Orders / Order Lines / Accounts /
Contacts / Products, or whatever you actually use):

```bash
po-ingest discover --out /tmp/smartsuite-schema.json
cp config/mapping.example.yaml config/mapping.yaml
# edit mapping.yaml: table names or IDs, and field labels/slugs from the dump
```

## Daily loop

1. Save incoming VA PDFs into `data/inbox/`
2. Preview matches (no writes):

   ```bash
   po-ingest process
   ```

3. When the dry-run looks right, move the PDF back to `data/inbox/` and write:

   ```bash
   po-ingest process --commit
   ```

4. Check the result folders:

   | Folder | Meaning |
   | --- | --- |
   | `data/processed/YYYY-MM-DD/` | Confirmed write; PDF is filed |
   | `data/review/` | Needs a person — missing field or ambiguous match |
   | `data/failed/` | Write happened but confirmation failed, or extract/API error |
   | `data/audit/` | JSON of what was parsed, matched, and written |

Single file:

```bash
po-ingest process-one /path/to/order.pdf --commit
```

## Accuracy rules

- Required on the PDF: PO number, at least one line with quantity, a ship-to
- Customer / product must match **one** existing SmartSuite record above the
  score threshold (default 92 / 94). Near-ties go to review.
- Contact is matched when the PO names one; an unmatched contact blocks write
- Duplicate PO numbers are skipped, never double-created
- Scanned image-only PDFs have no extractable text and go to failed/review

## Tests

```bash
pip install -e ".[dev]"
pytest
```
