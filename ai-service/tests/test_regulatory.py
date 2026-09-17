"""Unit tests for the Regulatory Monitoring Pipeline's deterministic layers.

Collectors are excluded on purpose — they're thin network wrappers. Everything
tested here is logic a wrong answer in would directly mislead a citizen.
"""

from datetime import datetime

import pytest

from app.models import Scheme
from regulatory_monitor.change_detection.rule_diff import (
    CHANGE_DEADLINE,
    CHANGE_DOCUMENTS,
    CHANGE_ELIGIBILITY_RULE,
    CHANGE_RULE_ADDED,
    CHANGE_RULE_REMOVED,
    diff_snapshots,
)
from regulatory_monitor.change_detection.text_diff import diff_text
from regulatory_monitor.conflict_resolution import SourceClaim, resolve_conflicts
from regulatory_monitor.impact_analysis.impact import analyse_impact


def _snapshot(income="300000", deadline="31 October", docs=("Income certificate",)):
    return {
        "name": "Test Scholarship",
        "benefit": "Rs 40000/year",
        "deadline": deadline,
        "eligibility_rules": [
            {"field": "state", "operator": "==", "value": "Rajasthan"},
            {"field": "income", "operator": "<=", "value": income},
        ],
        "documents_required": [{"name": d, "is_mandatory": True} for d in docs],
    }


# --- Stage 14: text diff ---------------------------------------------------


def test_identical_text_reports_no_change():
    result = diff_text("same content", "same content")
    assert result.changed is False
    assert result.similarity == 1.0


def test_text_diff_captures_added_and_removed_lines():
    result = diff_text("income limit 300000\nstate Rajasthan", "income limit 250000\nstate Rajasthan")
    assert result.changed is True
    assert any("250000" in line for line in result.added_lines)
    assert any("300000" in line for line in result.removed_lines)


def test_tiny_edit_in_large_document_is_flagged_cosmetic():
    base = "policy text line\n" * 2000
    result = diff_text(base, base + "visitor count 12345\n")
    assert result.is_cosmetic is True


# --- Stage 14: rule diff ---------------------------------------------------


def test_income_threshold_change_is_detected_and_critical():
    changes = diff_snapshots(_snapshot(income="300000"), _snapshot(income="250000"))
    income_changes = [c for c in changes if c.field == "income"]
    assert len(income_changes) == 1
    change = income_changes[0]
    assert change.change_type == CHANGE_ELIGIBILITY_RULE
    assert change.old_value == "300000"
    assert change.new_value == "250000"
    assert change.eligibility_critical is True


def test_no_change_produces_empty_diff():
    assert diff_snapshots(_snapshot(), _snapshot()) == []


def test_added_and_removed_rules_are_detected():
    old = _snapshot()
    new = _snapshot()
    new["eligibility_rules"] = [
        {"field": "state", "operator": "==", "value": "Rajasthan"},
        {"field": "age", "operator": "<=", "value": "25"},
    ]

    changes = diff_snapshots(old, new)
    types = {c.change_type for c in changes}
    assert CHANGE_RULE_ADDED in types
    assert CHANGE_RULE_REMOVED in types


def test_deadline_change_is_detected_but_not_eligibility_critical():
    changes = diff_snapshots(_snapshot(deadline="31 October"), _snapshot(deadline="15 November"))
    deadline_changes = [c for c in changes if c.change_type == CHANGE_DEADLINE]
    assert len(deadline_changes) == 1
    assert deadline_changes[0].eligibility_critical is False


def test_document_requirement_change_is_detected():
    changes = diff_snapshots(
        _snapshot(docs=("Income certificate",)),
        _snapshot(docs=("Income certificate", "Aadhaar card")),
    )
    doc_changes = [c for c in changes if c.change_type == CHANGE_DOCUMENTS]
    assert len(doc_changes) == 1
    assert "Aadhaar card" in doc_changes[0].summary


# --- Stage 15: impact analysis --------------------------------------------


def test_lowering_income_limit_splits_citizens_correctly():
    scheme = Scheme(
        slug="test-scheme",
        name="Test Scheme",
        department="Dept",
        category="Education",
        level="state",
        state="Rajasthan",
        benefit="Rs 40000",
        description="desc",
        source_url="https://example.gov.in",
    )
    old_rules = [{"field": "income", "operator": "<=", "value": "300000"}]
    new_rules = [{"field": "income", "operator": "<=", "value": "250000"}]

    profiles = [
        ("user_low", {"income": 200000}),    # passes both -> unchanged
        ("user_middle", {"income": 280000}), # passed old, fails new -> lost
        ("user_high", {"income": 400000}),   # failed both -> unchanged
    ]

    report = analyse_impact(scheme, old_rules, new_rules, profiles)
    assert report.total_evaluated == 3
    assert report.lost_eligibility == ["user_middle"]
    assert report.gained_eligibility == []
    assert report.unchanged == 2


def test_raising_income_limit_grants_eligibility():
    scheme = Scheme(
        slug="s", name="S", department="D", category="C", level="central",
        state=None, benefit="b", description="d", source_url="https://example.gov.in",
    )
    report = analyse_impact(
        scheme,
        [{"field": "income", "operator": "<=", "value": "250000"}],
        [{"field": "income", "operator": "<=", "value": "300000"}],
        [("user_middle", {"income": 280000})],
    )
    assert report.gained_eligibility == ["user_middle"]
    assert report.lost_eligibility == []


# --- Stage 16: conflict resolution ----------------------------------------


def test_higher_authority_source_wins_over_portal():
    claims = [
        SourceClaim("income", "300000", "https://portal.gov.in", "portal", datetime(2026, 1, 1)),
        SourceClaim("income", "250000", "https://gazette.gov.in", "gazette", datetime(2025, 6, 1)),
    ]
    resolutions = resolve_conflicts(claims)
    assert len(resolutions) == 1
    # Gazette wins despite being older — authority outranks recency.
    assert resolutions[0].winning_claim.value == "250000"
    assert resolutions[0].requires_human_review is True


def test_equal_authority_falls_back_to_recency():
    claims = [
        SourceClaim("income", "300000", "https://a.gov.in", "portal", datetime(2025, 1, 1)),
        SourceClaim("income", "250000", "https://b.gov.in", "portal", datetime(2026, 1, 1)),
    ]
    resolutions = resolve_conflicts(claims)
    assert resolutions[0].winning_claim.value == "250000"
    assert "most recently published" in resolutions[0].reason


def test_agreeing_sources_produce_no_conflict():
    claims = [
        SourceClaim("income", "250000", "https://a.gov.in", "portal", datetime(2025, 1, 1)),
        SourceClaim("income", "250000", "https://b.gov.in", "gazette", datetime(2026, 1, 1)),
    ]
    assert resolve_conflicts(claims) == []
