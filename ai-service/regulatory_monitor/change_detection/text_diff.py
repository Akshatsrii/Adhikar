"""Stage 14 — raw text change detection.

This layer answers only "did anything change, and roughly where?" using
exact hashing plus a line diff. It is intentionally dumb and deterministic:
it never decides whether a change *matters*, which is rule_diff's and
impact analysis's job. Keeping it dumb means a monitoring run is cheap
enough to schedule daily.
"""

import difflib
from dataclasses import dataclass


@dataclass
class TextChange:
    changed: bool
    added_lines: list[str]
    removed_lines: list[str]
    similarity: float

    @property
    def is_cosmetic(self) -> bool:
        """Very high similarity with tiny edits usually means a timestamp,
        visitor counter or banner rotated — not a policy change."""
        return self.changed and self.similarity > 0.995


def diff_text(old_text: str, new_text: str) -> TextChange:
    if old_text == new_text:
        return TextChange(changed=False, added_lines=[], removed_lines=[], similarity=1.0)

    old_lines = old_text.splitlines()
    new_lines = new_text.splitlines()

    added: list[str] = []
    removed: list[str] = []

    for line in difflib.unified_diff(old_lines, new_lines, lineterm="", n=0):
        if line.startswith("+++") or line.startswith("---") or line.startswith("@@"):
            continue
        if line.startswith("+"):
            added.append(line[1:].strip())
        elif line.startswith("-"):
            removed.append(line[1:].strip())

    similarity = difflib.SequenceMatcher(None, old_text, new_text).ratio()

    return TextChange(
        changed=True,
        added_lines=[line for line in added if line],
        removed_lines=[line for line in removed if line],
        similarity=similarity,
    )
