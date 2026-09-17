"""Shared types for all collectors.

A collector's only job is to fetch bytes from an official source and stamp
them with a content hash. It does not parse, interpret, or judge — that
keeps "did the source change at all?" (cheap, exact) separate from "what
changed?" (expensive, fuzzy).
"""

import hashlib
from dataclasses import dataclass, field
from datetime import datetime, timezone


@dataclass
class CollectedDocument:
    url: str
    content: bytes
    content_type: str
    fetched_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))

    @property
    def content_hash(self) -> str:
        return hashlib.sha256(self.content).hexdigest()


class CollectorError(Exception):
    pass


# Where a piece of information came from, ranked. Used by Stage 16's conflict
# resolution: a gazette notification outranks a portal page that disagrees
# with it, regardless of which one we happened to fetch more recently.
AUTHORITY_RANK: dict[str, int] = {
    "gazette": 4,
    "circular": 3,
    "notification": 3,
    "portal": 2,
    "press_release": 1,
    "unknown": 0,
}


def authority_rank(level: str) -> int:
    return AUTHORITY_RANK.get(level, 0)
