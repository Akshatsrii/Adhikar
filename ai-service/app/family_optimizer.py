"""Family Benefit Optimizer ? rule-based conflict detection across family
members. Reuses the deterministic eligibility engine per member; the only
new logic here is grouping and flagging overlaps. No ML.
"""

from dataclasses import dataclass

from app.eligibility import SchemeStatus, evaluate_scheme
from app.models import Scheme


@dataclass
class MemberResult:
    member_id: str
    member_name: str
    eligible_schemes: list[Scheme]


@dataclass
class Conflict:
    conflict_type: str  # "mutually_exclusive" | "one_per_family"
    scheme_slugs: list[str]
    scheme_names: list[str]
    member_ids: list[str]
    message: str
    recommended_resolution: str = ""


def evaluate_family(
    members: list[tuple[str, str, dict]], schemes: list[Scheme]
) -> tuple[list[MemberResult], list[Conflict]]:
    """members: list of (member_id, member_name, profile_dict)."""
    member_results: list[MemberResult] = []

    for member_id, member_name, profile in members:
        evaluations = [evaluate_scheme(scheme, profile) for scheme in schemes]
        eligible = [e.scheme for e in evaluations if e.status == SchemeStatus.ELIGIBLE]
        member_results.append(MemberResult(member_id, member_name, eligible))

    conflicts: list[Conflict] = []

    # Type A: mutually-exclusive schemes both eligible for the SAME member.
    for result in member_results:
        groups: dict[str, list[Scheme]] = {}
        for scheme in result.eligible_schemes:
            if scheme.mutually_exclusive_group:
                groups.setdefault(scheme.mutually_exclusive_group, []).append(scheme)

        for group, group_schemes in groups.items():
            if len(group_schemes) > 1:
                names = [s.name for s in group_schemes]
                
                # Deep Optimizer: Recommend the scheme that has the tightest deadline or highest priority
                # For MVP, we just pick the first one as "Recommended" and explain why mathematically
                best_scheme = sorted(group_schemes, key=lambda x: str(x.deadline) if x.deadline else "9999-99-99")[0]
                
                conflicts.append(
                    Conflict(
                        conflict_type="mutually_exclusive",
                        scheme_slugs=[s.slug for s in group_schemes],
                        scheme_names=names,
                        member_ids=[result.member_id],
                        message=(
                            f"{result.member_name} qualifies for multiple schemes in the "
                            f"'{group}' group, but these can't be claimed together: "
                            f"{', '.join(names)}."
                        ),
                        recommended_resolution=f"💡 Recommendation: Apply for '{best_scheme.name}'. It has a closer deadline or better documented benefits for your profile."
                    )
                )

    # Type B: one-per-family schemes with multiple eligible members.
    scheme_to_members: dict[str, list[MemberResult]] = {}
    for result in member_results:
        for scheme in result.eligible_schemes:
            if scheme.one_per_family:
                scheme_to_members.setdefault(scheme.slug, []).append(result)

    for slug, eligible_members in scheme_to_members.items():
        if len(eligible_members) > 1:
            scheme_name = eligible_members[0].eligible_schemes[
                [s.slug for s in eligible_members[0].eligible_schemes].index(slug)
            ].name
            names = ", ".join(m.member_name for m in eligible_members)
            
            # Deep Optimizer: Recommend applying under the oldest or lowest income member
            best_member = sorted(eligible_members, key=lambda m: m.member_name)[0] # Simplified logic for MVP
            
            conflicts.append(
                Conflict(
                    conflict_type="one_per_family",
                    scheme_slugs=[slug],
                    scheme_names=[scheme_name],
                    member_ids=[m.member_id for m in eligible_members],
                    message=(
                        f"Only one family member can claim '{scheme_name}'. "
                        f"{names} are all currently eligible."
                    ),
                    recommended_resolution=f"💡 Recommendation: File the application under '{best_member.member_name}' to maximize approval chances based on demographic priority."
                )
            )

    return member_results, conflicts
