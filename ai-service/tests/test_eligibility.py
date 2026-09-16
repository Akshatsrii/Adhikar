import pytest
from app.routers.eligibility import evaluate_scheme, SchemeStatus
from app.models import Scheme, EligibilityRule
from app.schemas import EligibilityProfile

def test_evaluate_scheme_eligible():
    scheme = Scheme(slug="test-scheme", name="Test Scheme")
    scheme.eligibility_rules = [
        EligibilityRule(field="income", operator="<=", value="500000"),
        EligibilityRule(field="state", operator="==", value="UP"),
        EligibilityRule(field="age", operator=">=", value="18")
    ]
    profile = EligibilityProfile(income=400000, state="UP", age=25)
    
    result = evaluate_scheme(scheme, profile)
    assert result.status == SchemeStatus.ELIGIBLE
    assert all(r.result.value == "pass" for r in result.rules)

def test_evaluate_scheme_ineligible_income():
    scheme = Scheme(slug="test-scheme")
    scheme.eligibility_rules = [
        EligibilityRule(field="income", operator="<=", value="500000"),
    ]
    profile = EligibilityProfile(income=600000)
    
    result = evaluate_scheme(scheme, profile)
    assert result.status == SchemeStatus.NOT_ELIGIBLE
    assert any("does not satisfy" in r.explanation for r in result.rules if r.result.value == "fail")

def test_evaluate_scheme_missing_fields():
    scheme = Scheme(slug="test-scheme")
    scheme.eligibility_rules = [
        EligibilityRule(field="state", operator="==", value="UP"),
        EligibilityRule(field="caste", operator="==", value="OBC")
    ]
    profile = EligibilityProfile(state="UP") # caste is missing
    
    result = evaluate_scheme(scheme, profile)
    assert result.status == SchemeStatus.MISSING_INFO
    assert any(r.result.value == "unknown" for r in result.rules)

def test_evaluate_scheme_in_operator():
    scheme = Scheme(slug="test-scheme")
    scheme.eligibility_rules = [
        EligibilityRule(field="state", operator="in", value="UP,MP,Bihar")
    ]
    
    res1 = evaluate_scheme(scheme, EligibilityProfile(state="UP"))
    assert res1.status == SchemeStatus.ELIGIBLE
    
    res2 = evaluate_scheme(scheme, EligibilityProfile(state="Delhi"))
    assert res2.status == SchemeStatus.NOT_ELIGIBLE

def test_evaluate_scheme_empty_rules():
    scheme = Scheme(slug="test-scheme")
    scheme.eligibility_rules = []
    profile = EligibilityProfile(income=100)
    
    result = evaluate_scheme(scheme, profile)
    assert result.status == SchemeStatus.ELIGIBLE
