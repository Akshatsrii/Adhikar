import pytest
from app.routers.eligibility import evaluate_scheme
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
    assert result.is_eligible is True
    assert len(result.missing_fields) == 0

def test_evaluate_scheme_ineligible_income():
    scheme = Scheme(slug="test-scheme")
    scheme.eligibility_rules = [
        EligibilityRule(field="income", operator="<=", value="500000"),
    ]
    profile = EligibilityProfile(income=600000)
    
    result = evaluate_scheme(scheme, profile)
    assert result.is_eligible is False
    assert any("Income criteria not met" in str(r.message) for r in result.reasons)

def test_evaluate_scheme_missing_fields():
    scheme = Scheme(slug="test-scheme")
    scheme.eligibility_rules = [
        EligibilityRule(field="state", operator="==", value="UP"),
        EligibilityRule(field="caste", operator="==", value="OBC")
    ]
    profile = EligibilityProfile(state="UP") # caste is missing
    
    result = evaluate_scheme(scheme, profile)
    assert result.is_eligible is False
    assert "caste" in result.missing_fields

def test_evaluate_scheme_in_operator():
    scheme = Scheme(slug="test-scheme")
    scheme.eligibility_rules = [
        EligibilityRule(field="state", operator="in", value="UP,MP,Bihar")
    ]
    
    res1 = evaluate_scheme(scheme, EligibilityProfile(state="UP"))
    assert res1.is_eligible is True
    
    res2 = evaluate_scheme(scheme, EligibilityProfile(state="Delhi"))
    assert res2.is_eligible is False

def test_evaluate_scheme_empty_rules():
    scheme = Scheme(slug="test-scheme")
    scheme.eligibility_rules = []
    profile = EligibilityProfile(income=100)
    
    result = evaluate_scheme(scheme, profile)
    assert result.is_eligible is True # No rules means universally eligible
