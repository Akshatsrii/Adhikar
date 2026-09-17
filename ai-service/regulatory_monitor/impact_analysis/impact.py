"""Stage 15 + 17 — who does this change actually affect, and how?

This is what separates Adhikar from a scraper. A scraper says "the PDF changed".
This module answers "37 citizens lose eligibility, 147 keep it, and here is who".

The mechanism is deliberately boring: re-run the existing deterministic
eligibility engine twice per citizen — once against the old rules, once against
the new — and compare. No model, no heuristic, no guessing. That also means
the impact numbers shown to an admin are exactly reproducible.
"""

from dataclasses import dataclass, field

from app.eligibility import SchemeStatus, evaluate_scheme
from app.models import EligibilityRule, Scheme


@dataclass
class CitizenImpact:
    user_id: str
    old_status: str
    new_status: str

    @property
    def transition(self) -> str:
        if self.old_status == SchemeStatus.ELIGIBLE.value and self.new_status != SchemeStatus.ELIGIBLE.value:
            return "lost_eligibility"
        if self.old_status != SchemeStatus.ELIGIBLE.value and self.new_status == SchemeStatus.ELIGIBLE.value:
            return "gained_eligibility"
        return "unchanged"


@dataclass
class ImpactReport:
    scheme_slug: str
    total_evaluated: int = 0
    lost_eligibility: list[str] = field(default_factory=list)
    gained_eligibility: list[str] = field(default_factory=list)
    unchanged: int = 0

    def to_dict(self) -> dict:
        return {
            "scheme_slug": self.scheme_slug,
            "total_evaluated": self.total_evaluated,
            "lost_eligibility_count": len(self.lost_eligibility),
            "gained_eligibility_count": len(self.gained_eligibility),
            "unchanged_count": self.unchanged,
            "lost_eligibility_user_ids": self.lost_eligibility,
            "gained_eligibility_user_ids": self.gained_eligibility,
        }

    @property
    def headline(self) -> str:
        return (
            f"{self.total_evaluated} citizens evaluated — "
            f"{len(self.lost_eligibility)} may lose eligibility, "
            f"{len(self.gained_eligibility)} may gain it, "
            f"{self.unchanged} unaffected."
        )


def _scheme_with_rules(base: Scheme, rules: list[dict]) -> Scheme:
    """Builds a detached, in-memory Scheme carrying a hypothetical rule set.
    Detached on purpose: this object must never be flushed to the database,
    because the new rules are unapproved at this point in the pipeline.
    """
    shadow = Scheme(
        slug=base.slug,
        name=base.name,
        department=base.department,
        category=base.category,
        level=base.level,
        state=base.state,
        benefit=base.benefit,
        description=base.description,
        source_url=base.source_url,
    )
    shadow.eligibility_rules = [
        EligibilityRule(
            field=r["field"],
            operator=r["operator"],
            value=str(r["value"]),
        )
        for r in rules
    ]
    return shadow


def analyse_impact(
    scheme: Scheme,
    old_rules: list[dict],
    new_rules: list[dict],
    citizen_profiles: list[tuple[str, dict]],
) -> ImpactReport:
    """citizen_profiles: list of (user_id, profile_dict)."""
    report = ImpactReport(scheme_slug=scheme.slug)

    old_scheme = _scheme_with_rules(scheme, old_rules)
    new_scheme = _scheme_with_rules(scheme, new_rules)

    for user_id, profile in citizen_profiles:
        old_status = evaluate_scheme(old_scheme, profile).status.value
        new_status = evaluate_scheme(new_scheme, profile).status.value

        impact = CitizenImpact(user_id=user_id, old_status=old_status, new_status=new_status)
        report.total_evaluated += 1

        if impact.transition == "lost_eligibility":
            report.lost_eligibility.append(user_id)
        elif impact.transition == "gained_eligibility":
            report.gained_eligibility.append(user_id)
        else:
            report.unchanged += 1

    return report
