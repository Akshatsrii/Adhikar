import pytest
import os
import sys
from pathlib import Path

# Add project root to path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.database import SessionLocal
from scripts.run_eval import run_rag_eval, run_eligibility_eval

DATA_DIR = Path(__file__).resolve().parent / "data"

@pytest.fixture(scope="module")
def db():
    session = SessionLocal()
    yield session
    session.close()

def test_rag_accuracy_meets_threshold(db):
    """Ensure RAG retrieval accuracy does not drop below 80%."""
    accuracy, total = run_rag_eval(db, DATA_DIR / "rag_golden_set.json")
    if total > 0:
        assert accuracy >= 80.0, f"RAG accuracy {accuracy}% is below threshold 80%"

def test_eligibility_accuracy_is_perfect(db):
    """Ensure Eligibility engine accuracy is strictly 100%."""
    accuracy, total = run_eligibility_eval(db, DATA_DIR / "eligibility_golden_set.json")
    if total > 0:
        assert accuracy == 100.0, f"Eligibility accuracy {accuracy}% is not 100%"

