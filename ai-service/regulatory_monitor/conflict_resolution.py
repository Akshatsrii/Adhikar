"""Stage 16 — reconciling sources that disagree.

Real government data contradicts itself constantly: a department portal still
shows last year's income limit while a gazette notification has already lowered
it. Silently picking one is the dangerous option, because a citizen acting on
the wrong number wastes a real application.

So this module does two things and refuses to do a third:
1. Detect that two sources disagree on the same field.
2. Rank them by authority first, recency second, and propose a winner.
3. It does NOT apply the winner. Every conflict still goes to a human
   (Stage 19) — it just arrives pre-argued.
"""

from dataclasses import dataclass
from datetime import datetime

from regulatory_monitor.collectors.base import authority_rank


@dataclass
class SourceClaim:
    field: str
    value: str
    source_url: str
    authority_level: str
    published_at: datetime | None


@dataclass
class ConflictResolution:
    field: str
    winning_claim: SourceClaim
    losing_claims: list[SourceClaim]
    reason: str
    requires_human_review: bool = True

    def to_dict(self) -> dict:
        return {
            "field": self.field,
            "winning_value": self.winning_claim.value,
            "winning_source": self.winning_claim.source_url,
            "winning_authority": self.winning_claim.authority_level,
            "losing_values": [
                {"value": c.value, "source": c.source_url, "authority": c.authority_level}
                for c in self.losing_claims
            ],
            "reason": self.reason,
            "requires_human_review": self.requires_human_review,
        }


def _sort_key(claim: SourceClaim) -> tuple[int, float]:
    published_ts = claim.published_at.timestamp() if claim.published_at else 0.0
    return (authority_rank(claim.authority_level), published_ts)


def resolve_conflicts(claims: list[SourceClaim]) -> list[ConflictResolution]:
    """Groups claims by field and resolves any field where sources disagree."""
    by_field: dict[str, list[SourceClaim]] = {}
    for claim in claims:
        by_field.setdefault(claim.field, []).append(claim)

    resolutions: list[ConflictResolution] = []

    for field, field_claims in by_field.items():
        distinct_values = {c.value for c in field_claims}
        if len(distinct_values) <= 1:
            continue  # sources agree — nothing to resolve

        ranked = sorted(field_claims, key=_sort_key, reverse=True)
        winner, losers = ranked[0], ranked[1:]

        top_rank = authority_rank(winner.authority_level)
        tied_on_authority = [c for c in losers if authority_rank(c.authority_level) == top_rank]

        if tied_on_authority:
            reason = (
                f"Sources of equal authority ('{winner.authority_level}') disagree on "
                f"{field}; the most recently published value was preferred."
            )
        else:
            reason = (
                f"'{winner.authority_level}' outranks "
                f"{', '.join(sorted({c.authority_level for c in losers}))} for {field}."
            )

        resolutions.append(
            ConflictResolution(
                field=field,
                winning_claim=winner,
                losing_claims=losers,
                reason=reason,
            )
        )

    return resolutions
