"""Stage 13 — fetches an HTML page from an official government portal."""

import httpx
from regulatory_monitor.collectors.base import CollectedDocument, CollectorError

USER_AGENT = "AdhikarRegulatoryMonitor/1.0 (+https://github.com/Akshatsrii/Adhikar)"
TIMEOUT_SECONDS = 30


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
        raise CollectorError(f"Failed to fetch {url}: {exc}") from exc

    return CollectedDocument(
        url=url,
        content=response.content,
        content_type=response.headers.get("content-type", "text/html"),
    )
