import pytest
from app.models import Scheme, EligibilityRule
from app.family_optimizer import evaluate_family, MemberResult, Conflict

def test_evaluate_family_no_conflicts():
    scheme1 = Scheme(id=1, slug="scheme1", name="Scheme 1", mutually_exclusive_group=None, one_per_family=False)
    scheme1.eligibility_rules = [EligibilityRule(field="age", operator=">=", value="18")]
    
    scheme2 = Scheme(id=2, slug="scheme2", name="Scheme 2", mutually_exclusive_group=None, one_per_family=False)
    scheme2.eligibility_rules = [EligibilityRule(field="state", operator="==", value="Delhi")]

    members = [
        ("m1", "John", {"age": 25, "state": "Delhi"}),
        ("m2", "Jane", {"age": 15, "state": "Delhi"})
    ]

    results, conflicts = evaluate_family(members, [scheme1, scheme2])

    assert len(results) == 2
    assert len(results[0].eligible_schemes) == 2
    assert len(results[1].eligible_schemes) == 1
    assert len(conflicts) == 0

def test_evaluate_family_mutually_exclusive():
    scheme1 = Scheme(id=1, slug="s1", name="S1", mutually_exclusive_group="scholarship", one_per_family=False)
    scheme1.eligibility_rules = []
    
    scheme2 = Scheme(id=2, slug="s2", name="S2", mutually_exclusive_group="scholarship", one_per_family=False)
    scheme2.eligibility_rules = []

    members = [
        ("m1", "John", {})
    ]

    results, conflicts = evaluate_family(members, [scheme1, scheme2])

    assert len(conflicts) == 1
    assert conflicts[0].conflict_type == "mutually_exclusive"
    assert conflicts[0].member_ids == ["m1"]
    assert "S1" in conflicts[0].scheme_names
    assert "S2" in conflicts[0].scheme_names

def test_evaluate_family_one_per_family():
    scheme1 = Scheme(id=1, slug="s1", name="S1", mutually_exclusive_group=None, one_per_family=True)
    scheme1.eligibility_rules = []

    members = [
        ("m1", "John", {}),
        ("m2", "Jane", {})
    ]

    results, conflicts = evaluate_family(members, [scheme1])

    assert len(conflicts) == 1
    assert conflicts[0].conflict_type == "one_per_family"
    assert "m1" in conflicts[0].member_ids
    assert "m2" in conflicts[0].member_ids
    assert conflicts[0].scheme_slugs == ["s1"]
