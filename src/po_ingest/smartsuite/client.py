"""Thin SmartSuite REST client. This is the only place that writes records."""

from __future__ import annotations

from pathlib import Path
from typing import Any

import httpx


class SmartSuiteError(RuntimeError):
    def __init__(self, message: str, status_code: int | None = None, body: Any = None):
        super().__init__(message)
        self.status_code = status_code
        self.body = body


class SmartSuiteClient:
    """Authenticated client for the SmartSuite REST API.

    Writes use:
      POST /applications/{table_id}/records/
      POST /applications/{table_id}/records/bulk/
      POST /recordfiles/{table_id}/{record_id}/{field_slug}/

    Confirmation uses:
      GET  /applications/{table_id}/records/{record_id}/
      POST /applications/{table_id}/records/list/
    """

    def __init__(
        self,
        api_key: str,
        workspace_id: str,
        base_url: str = "https://app.smartsuite.com/api/v1",
        timeout: float = 30.0,
        transport: httpx.BaseTransport | None = None,
    ) -> None:
        if not api_key:
            raise SmartSuiteError(
                "SMARTSUITE_API_KEY is missing. Add it from SmartSuite → My Profile → API Key."
            )
        if not workspace_id:
            raise SmartSuiteError(
                "SMARTSUITE_WORKSPACE_ID is missing. It is the 8 characters after "
                "https://app.smartsuite.com/ in your workspace URL."
            )
        self.workspace_id = workspace_id
        self.base_url = base_url.rstrip("/")
        headers = {
            "Authorization": f"Token {api_key}",
            "ACCOUNT-ID": workspace_id,
            "Content-Type": "application/json",
        }
        self._client = httpx.Client(
            base_url=self.base_url,
            headers=headers,
            timeout=timeout,
            transport=transport,
        )

    def close(self) -> None:
        self._client.close()

    def __enter__(self) -> SmartSuiteClient:
        return self

    def __exit__(self, *exc: object) -> None:
        self.close()

    def list_tables(self, solution_id: str | None = None) -> list[dict[str, Any]]:
        params: dict[str, str] = {}
        if solution_id:
            params["solution"] = solution_id
        return self._request("GET", "/applications/", params=params)

    def get_table(self, table_id: str) -> dict[str, Any]:
        return self._request("GET", f"/applications/{table_id}/")

    def list_records(
        self,
        table_id: str,
        *,
        filters: list[dict[str, Any]] | None = None,
        operator: str = "and",
        hydrated: bool = True,
        limit: int = 100,
        offset: int = 0,
    ) -> dict[str, Any]:
        body: dict[str, Any] = {"hydrated": hydrated}
        if filters:
            body["filter"] = {"operator": operator, "fields": filters}
        return self._request(
            "POST",
            f"/applications/{table_id}/records/list/",
            params={"offset": offset, "limit": limit},
            json=body,
        )

    def list_all_records(
        self,
        table_id: str,
        *,
        filters: list[dict[str, Any]] | None = None,
        hydrated: bool = True,
        page_size: int = 100,
    ) -> list[dict[str, Any]]:
        items: list[dict[str, Any]] = []
        offset = 0
        while True:
            page = self.list_records(
                table_id,
                filters=filters,
                hydrated=hydrated,
                limit=page_size,
                offset=offset,
            )
            batch = page.get("items") or []
            items.extend(batch)
            if len(batch) < page_size:
                break
            offset += page_size
        return items

    def get_record(self, table_id: str, record_id: str) -> dict[str, Any]:
        return self._request(
            "GET", f"/applications/{table_id}/records/{record_id}/"
        )

    def create_record(self, table_id: str, payload: dict[str, Any]) -> dict[str, Any]:
        """Write one record. Required fields missing → HTTP 422."""
        return self._request(
            "POST", f"/applications/{table_id}/records/", json=payload
        )

    def bulk_create_records(
        self, table_id: str, payloads: list[dict[str, Any]]
    ) -> list[dict[str, Any]]:
        created: list[dict[str, Any]] = []
        for start in range(0, len(payloads), 25):
            chunk = payloads[start : start + 25]
            response = self._request(
                "POST",
                f"/applications/{table_id}/records/bulk/",
                json={"items": chunk},
            )
            if isinstance(response, list):
                created.extend(response)
            else:
                created.extend(response.get("items") or response.get("records") or [])
        return created

    def upload_file(
        self,
        table_id: str,
        record_id: str,
        field_slug: str,
        path: Path,
    ) -> dict[str, Any]:
        """Attach a binary file after the record exists."""
        with path.open("rb") as handle:
            files = {"files": (path.name, handle, "application/pdf")}
            data = {"filename": path.name}
            response = self._client.post(
                f"/recordfiles/{table_id}/{record_id}/{field_slug}/",
                files=files,
                data=data,
                headers={
                    "Authorization": self._client.headers["Authorization"],
                    "ACCOUNT-ID": self.workspace_id,
                },
            )
        return self._parse(response)

    def record_url(self, table_id: str, record_id: str) -> str:
        return f"https://app.smartsuite.com/{self.workspace_id}/r/{table_id}/{record_id}"

    def _request(
        self,
        method: str,
        path: str,
        *,
        params: dict[str, Any] | None = None,
        json: Any = None,
    ) -> Any:
        response = self._client.request(method, path, params=params, json=json)
        return self._parse(response)

    def _parse(self, response: httpx.Response) -> Any:
        if response.status_code >= 400:
            detail: Any
            try:
                detail = response.json()
            except ValueError:
                detail = response.text
            raise SmartSuiteError(
                f"SmartSuite {response.request.method} {response.request.url} "
                f"failed ({response.status_code}): {detail}",
                status_code=response.status_code,
                body=detail,
            )
        if not response.content:
            return {}
        return response.json()
