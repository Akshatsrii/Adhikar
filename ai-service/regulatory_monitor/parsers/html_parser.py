"""Stage 13 — HTML to clean text.

Deliberately uses stdlib HTMLParser rather than adding a scraping dependency:
we only need readable text for diffing, not DOM traversal. Script/style
contents are dropped because government portals embed analytics blobs that
change on every request and would otherwise produce endless false-positive diffs.
"""

import re
from html.parser import HTMLParser

SKIP_TAGS = {"script", "style", "noscript", "svg"}


class _TextExtractor(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self._parts: list[str] = []
        self._skip_depth = 0

    def handle_starttag(self, tag: str, attrs) -> None:
        if tag in SKIP_TAGS:
            self._skip_depth += 1

    def handle_endtag(self, tag: str) -> None:
        if tag in SKIP_TAGS and self._skip_depth > 0:
            self._skip_depth -= 1

    def handle_data(self, data: str) -> None:
        if self._skip_depth == 0 and data.strip():
            self._parts.append(data.strip())

    def text(self) -> str:
        return "\n".join(self._parts)


def parse(content: bytes) -> str:
    extractor = _TextExtractor()
    extractor.feed(content.decode("utf-8", errors="replace"))
    text = extractor.text()

    # Collapse runs of whitespace so cosmetic reflows don't register as changes.
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()
