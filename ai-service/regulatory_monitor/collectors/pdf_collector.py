"""Stage 13 — fetches a PDF circular/notification from an official source."""

import httpx
from regulatory_monitor.collectors.base import CollectedDocument, CollectorError

USER_AGENT = "AdhikarRegulatoryMonitor/1.0 (+https://github.com/Akshatsrii/Adhikar)"
TIMEOUT_SECONDS = 60  # government PDF servers are frequently slow
MAX_PDF_BYTES = 25 * 1024 * 1024


def collect(url: str) -> CollectedDocument:
    try:
        response = httpx.get(
            url,
            timeout=TIMEOUT_SECONDS,
            follow_redirects=True,
            headers={"User-Agent": USER_AGENT},
        )
        response.raise_for_status()
    except httpx.HTTPError as exc:
        raise CollectorError(f"Failed to fetch PDF {url}: {exc}") from exc

    if len(response.content) > MAX_PDF_BYTES:
        raise CollectorError(f"PDF at {url} exceeds {MAX_PDF_BYTES} bytes")

    return CollectedDocument(
        url=url,
        content=response.content,
        content_type=response.headers.get("content-type", "application/pdf"),
    )
