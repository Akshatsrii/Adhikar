"""Deterministic eligibility rule engine.

No LLM, no ML model, no network call happens in this file — this is the
one place in Adhikar where a citizen's eligibility is actually decided,
and it has to be 100% reproducible and explainable. The LLM's only role
in eligibility is upstream and offline: turning a scheme PDF into the
EligibilityRule rows this file evaluates.
"""

from dataclasses import dataclass
from enum import Enum

from app.models import EligibilityRule, Scheme

NUMERIC_FIELDS = {"income", "age", "landholding"}


class RuleResult(str, Enum):
    PASS = "pass"
    FAIL = "fail"
    UNKNOWN = "unknown"  # profile doesn't have this field yet


class SchemeStatus(str, Enum):
    ELIGIBLE = "eligible"
    NOT_ELIGIBLE = "not_eligible"
    MISSING_INFO = "missing_info"


@dataclass
class RuleEvaluation:
    field: str
    operator: str
    value: str
    profile_value: str | None
    result: RuleResult
    explanation: str


@dataclass
class SchemeEvaluation:
    scheme: Scheme
    status: SchemeStatus
    rules: list[RuleEvaluation]


def _to_number(raw: str | int | float | None) -> float | None:
    if raw is None:
        return None
    try:
        return float(raw)
    except (TypeError, ValueError):
        return None


def evaluate_rule(rule: EligibilityRule, profile: dict) -> RuleEvaluation:
    profile_value = getattr(profile, rule.field, None)

    if profile_value is None or profile_value == "":
        return RuleEvaluation(
            field=rule.field,
            operator=rule.operator,
            value=rule.value,
            profile_value=None,
            result=RuleResult.UNKNOWN,
            explanation=f"We don't know your {rule.field} yet — add it to your profile.",
        )

    if rule.field in NUMERIC_FIELDS:
        pv = _to_number(profile_value)
        rv = _to_number(rule.value)
        if pv is None or rv is None:
            return RuleEvaluation(
                field=rule.field,
                operator=rule.operator,
                value=rule.value,
                profile_value=str(profile_value),
                result=RuleResult.UNKNOWN,
                explanation=f"Couldn't compare {rule.field} — invalid number.",
            )

        ops = {
            "<=": pv <= rv,
            ">=": pv >= rv,
            "<": pv < rv,
            ">": pv > rv,
            "==": pv == rv,
            "!=": pv != rv,
        }
        passed = ops.get(rule.operator)
        if passed is None:
            return RuleEvaluation(
                field=rule.field,
                operator=rule.operator,
                value=rule.value,
                profile_value=str(profile_value),
                result=RuleResult.UNKNOWN,
                explanation=f"Unsupported operator '{rule.operator}' for {rule.field}.",
            )

        outcome = RuleResult.PASS if passed else RuleResult.FAIL
        explanation = (
            f"Your {rule.field} ({pv:g}) {'satisfies' if passed else 'does not satisfy'} "
            f"the requirement ({rule.operator} {rv:g})."
        )
        return RuleEvaluation(rule.field, rule.operator, rule.value, str(profile_value), outcome, explanation)

    # categorical field: state, education, occupation, etc.
    pv_str = str(profile_value).strip().lower()

    if rule.operator == "in":
        allowed = [v.strip().lower() for v in rule.value.split(",")]
        passed = pv_str in allowed
    elif rule.operator == "==":
        passed = pv_str == rule.value.strip().lower()
    elif rule.operator == "!=":
        passed = pv_str != rule.value.strip().lower()
    else:
        return RuleEvaluation(
            field=rule.field,
            operator=rule.operator,
            value=rule.value,
            profile_value=str(profile_value),
            result=RuleResult.UNKNOWN,
            explanation=f"Unsupported operator '{rule.operator}' for {rule.field}.",
        )

    outcome = RuleResult.PASS if passed else RuleResult.FAIL
    explanation = (
        f"Your {rule.field} ('{profile_value}') "
        f"{'matches' if passed else 'does not match'} the requirement ({rule.operator} {rule.value})."
    )
    return RuleEvaluation(rule.field, rule.operator, rule.value, str(profile_value), outcome, explanation)


def evaluate_scheme(scheme: Scheme, profile: dict) -> SchemeEvaluation:
    evaluations = [evaluate_rule(rule, profile) for rule in scheme.eligibility_rules]

    if any(e.result == RuleResult.FAIL for e in evaluations):
        status = SchemeStatus.NOT_ELIGIBLE
    elif any(e.result == RuleResult.UNKNOWN for e in evaluations):
        status = SchemeStatus.MISSING_INFO
    else:
        status = SchemeStatus.ELIGIBLE

    return SchemeEvaluation(scheme=scheme, status=status, rules=evaluations)
