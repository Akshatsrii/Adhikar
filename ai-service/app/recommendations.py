"""Recommendation scoring — plain weighted math on top of the deterministic
eligibility engine. No model, no training, nothing probabilistic: a scheme's
score is fully derivable from its rule evaluations, so "why is this ranked
here" always has a concrete answer.
"""

from dataclasses import dataclass

from app.eligibility import RuleResult, SchemeEvaluation, SchemeStatus

# Ranking is lexicographic: status first (eligible always outranks
# missing_info), match_percentage second, "has an explicit deadline" third
# (a scheme with a real deadline is more time-sensitive than a rolling one).
_STATUS_RANK = {
    SchemeStatus.ELIGIBLE: 2,
    SchemeStatus.MISSING_INFO: 1,
    SchemeStatus.NOT_ELIGIBLE: 0,
}


@dataclass
class ScoredScheme:
    evaluation: SchemeEvaluation
    match_percentage: int
    sort_key: tuple[int, int, int]


def match_percentage(evaluation: SchemeEvaluation) -> int:
    known = [r for r in evaluation.rules if r.result != RuleResult.UNKNOWN]
    if not known:
        return 0
    passed = [r for r in known if r.result == RuleResult.PASS]
    return round(len(passed) / len(known) * 100)


def score_scheme(evaluation: SchemeEvaluation) -> ScoredScheme:
    pct = match_percentage(evaluation)
    has_deadline = 1 if evaluation.scheme.deadline and "rolling" not in evaluation.scheme.deadline.lower() else 0

    sort_key = (_STATUS_RANK[evaluation.status], pct, has_deadline)
    return ScoredScheme(evaluation=evaluation, match_percentage=pct, sort_key=sort_key)


def rank_schemes(evaluations: list[SchemeEvaluation]) -> list[ScoredScheme]:
    scored = [score_scheme(e) for e in evaluations if e.status != SchemeStatus.NOT_ELIGIBLE]
    scored.sort(key=lambda s: s.sort_key, reverse=True)
    return scored


def build_action_items(evaluations: list[SchemeEvaluation]) -> list[dict]:
    """Aggregate the missing profile fields across all missing_info schemes
    so the dashboard can say "add your income — unlocks 3 more matches"
    instead of repeating the same ask per scheme."""
    field_counts: dict[str, int] = {}

    for evaluation in evaluations:
        if evaluation.status != SchemeStatus.MISSING_INFO:
            continue
        for rule in evaluation.rules:
            if rule.result == RuleResult.UNKNOWN:
                field_counts[rule.field] = field_counts.get(rule.field, 0) + 1

    items = [
        {
            "field": field,
            "message": f"Add your {field} to your profile — it affects {count} more scheme"
            f"{'s' if count != 1 else ''}.",
            "affected_scheme_count": count,
        }
        for field, count in field_counts.items()
    ]
    items.sort(key=lambda i: i["affected_scheme_count"], reverse=True)
    return items
