"""Stage 14 — structured, rule-level change detection.

This is the layer that produces citizen-meaningful change records. It compares
two *structured snapshots* of a scheme (not raw text), so the output is a list
of typed facts like "income limit moved from 300000 to 250000" rather than a
wall of diff lines.

Nothing here is probabilistic — given two snapshots, the output is fixed. The
LLM's role upstream is producing the new snapshot from source text; comparing
snapshots is plain data work, and it stays that way because these records are
what ultimately change a citizen's eligibility.
"""

from dataclasses import asdict, dataclass

# Fields whose change can flip a citizen's eligibility. Used to mark a change
# as requiring an eligibility re-check (Stage 17).
ELIGIBILITY_CRITICAL_FIELDS = {"income", "age", "state", "education", "occupation", "landholding"}

CHANGE_ELIGIBILITY_RULE = "eligibility_rule_changed"
CHANGE_RULE_ADDED = "eligibility_rule_added"
CHANGE_RULE_REMOVED = "eligibility_rule_removed"
CHANGE_DEADLINE = "deadline_changed"
CHANGE_BENEFIT = "benefit_changed"
CHANGE_DOCUMENTS = "documents_changed"
CHANGE_STATUS = "scheme_status_changed"


@dataclass
class RuleChange:
    change_type: str
    field: str | None
    old_value: str | None
    new_value: str | None
    summary: str
    eligibility_critical: bool

    def to_dict(self) -> dict:
        return asdict(self)


def _rule_key(rule: dict) -> str:
    return f"{rule.get('field')}|{rule.get('operator')}"


def diff_snapshots(old: dict, new: dict) -> list[RuleChange]:
    """old/new are scheme snapshots shaped like the ingestion JSON:
    {name, benefit, deadline, eligibility_rules: [...], documents_required: [...]}
    """
    changes: list[RuleChange] = []
    changes.extend(_diff_eligibility_rules(old, new))
    changes.extend(_diff_scalar_fields(old, new))
    changes.extend(_diff_documents(old, new))
    return changes


def _diff_eligibility_rules(old: dict, new: dict) -> list[RuleChange]:
    changes: list[RuleChange] = []

    old_rules = {_rule_key(r): r for r in old.get("eligibility_rules", [])}
    new_rules = {_rule_key(r): r for r in new.get("eligibility_rules", [])}

    for key, new_rule in new_rules.items():
        field = new_rule.get("field")
        critical = field in ELIGIBILITY_CRITICAL_FIELDS

        if key not in old_rules:
            changes.append(
                RuleChange(
                    change_type=CHANGE_RULE_ADDED,
                    field=field,
                    old_value=None,
                    new_value=str(new_rule.get("value")),
                    summary=(
                        f"New eligibility condition added: {field} "
                        f"{new_rule.get('operator')} {new_rule.get('value')}."
                    ),
                    eligibility_critical=critical,
                )
            )
            continue

        old_value = str(old_rules[key].get("value"))
        new_value = str(new_rule.get("value"))

        if old_value != new_value:
            changes.append(
                RuleChange(
                    change_type=CHANGE_ELIGIBILITY_RULE,
                    field=field,
                    old_value=old_value,
                    new_value=new_value,
                    summary=(
                        f"Eligibility threshold for {field} changed from "
                        f"{old_value} to {new_value}."
                    ),
                    eligibility_critical=critical,
                )
            )

    for key, old_rule in old_rules.items():
        if key not in new_rules:
            field = old_rule.get("field")
            changes.append(
                RuleChange(
                    change_type=CHANGE_RULE_REMOVED,
                    field=field,
                    old_value=str(old_rule.get("value")),
                    new_value=None,
                    summary=(
                        f"Eligibility condition removed: {field} "
                        f"{old_rule.get('operator')} {old_rule.get('value')}."
                    ),
                    eligibility_critical=field in ELIGIBILITY_CRITICAL_FIELDS,
                )
            )

    return changes


def _diff_scalar_fields(old: dict, new: dict) -> list[RuleChange]:
    changes: list[RuleChange] = []

    scalar_map = [
        ("deadline", CHANGE_DEADLINE, "Application deadline"),
        ("benefit", CHANGE_BENEFIT, "Benefit amount/description"),
        ("status", CHANGE_STATUS, "Scheme status"),
    ]

    for field, change_type, label in scalar_map:
        old_value = old.get(field)
        new_value = new.get(field)

        if old_value == new_value:
            continue
        if old_value is None and new_value is None:
            continue

        changes.append(
            RuleChange(
                change_type=change_type,
                field=field,
                old_value=str(old_value) if old_value is not None else None,
                new_value=str(new_value) if new_value is not None else None,
                summary=f"{label} changed from '{old_value}' to '{new_value}'.",
                # A closed/suspended scheme changes who can actually benefit,
                # so it re-checks; a reworded benefit line does not.
                eligibility_critical=(change_type == CHANGE_STATUS),
            )
        )

    return changes


def _diff_documents(old: dict, new: dict) -> list[RuleChange]:
    old_docs = {d.get("name") for d in old.get("documents_required", [])}
    new_docs = {d.get("name") for d in new.get("documents_required", [])}

    added = sorted(new_docs - old_docs)
    removed = sorted(old_docs - new_docs)

    if not added and not removed:
        return []

    parts = []
    if added:
        parts.append(f"now requires: {', '.join(added)}")
    if removed:
        parts.append(f"no longer requires: {', '.join(removed)}")

    return [
        RuleChange(
            change_type=CHANGE_DOCUMENTS,
            field="documents_required",
            old_value=", ".join(sorted(old_docs)) or None,
            new_value=", ".join(sorted(new_docs)) or None,
            summary="Required documents changed — " + "; ".join(parts) + ".",
            # Documents affect whether an application succeeds, not whether the
            # citizen qualifies — so no eligibility re-check, but still notify.
            eligibility_critical=False,
        )
    ]
