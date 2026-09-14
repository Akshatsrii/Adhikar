from app.eligibility import RuleResult, SchemeEvaluation, SchemeStatus
from app.recommendations import match_percentage


def test_match_percentage_no_rules():
    # A scheme with no rules evaluated shouldn't happen, but should handle gracefully
    eval_mock = SchemeEvaluation(
        scheme=None,  # type: ignore
        status=SchemeStatus.ELIGIBLE,
        rules=[],
    )
    assert match_percentage(eval_mock) == 0


def test_match_percentage_all_unknown():
    # If all rules are unknown, match is 0
    from app.eligibility import RuleEvaluation
    
    eval_mock = SchemeEvaluation(
        scheme=None,  # type: ignore
        status=SchemeStatus.MISSING_INFO,
        rules=[
            RuleEvaluation("income", "<=", "50000", None, RuleResult.UNKNOWN, "Unknown"),
        ],
    )
    assert match_percentage(eval_mock) == 0


def test_match_percentage_mixed():
    from app.eligibility import RuleEvaluation
    
    eval_mock = SchemeEvaluation(
        scheme=None,  # type: ignore
        status=SchemeStatus.MISSING_INFO,
        rules=[
            RuleEvaluation("income", "<=", "50000", "40000", RuleResult.PASS, "Pass"),
            RuleEvaluation("state", "==", "Rajasthan", "Delhi", RuleResult.FAIL, "Fail"),
            RuleEvaluation("age", ">=", "18", None, RuleResult.UNKNOWN, "Unknown"),
        ],
    )
    # known = 2 (PASS, FAIL)
    # passed = 1
    # 1/2 = 50%
    assert match_percentage(eval_mock) == 50
