import json
import logging
import os
import sys
from datetime import datetime
from pathlib import Path

# Add project root to path so `app` can be imported
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.database import SessionLocal
from app.models import Scheme, SchemeChunk, EvalRun
from app.gemini import embed_text
from app.eligibility import evaluate_scheme
from sqlalchemy import select

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger("eval")

DATA_DIR = Path(__file__).resolve().parent.parent / "tests" / "data"
LOG_DIR = Path(__file__).resolve().parent.parent / "tests" / "logs"

def run_rag_eval(db, golden_set_path: Path):
    if not golden_set_path.exists():
        logger.warning(f"RAG golden set not found at {golden_set_path}")
        return 0, 0

    with open(golden_set_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    
    if not data:
        return 0, 0

    correct = 0
    for item in data:
        question = item["question"]
        expected_slug = item["expected_scheme_slug"]

        query_vector = embed_text(question, task_type="RETRIEVAL_QUERY")
        stmt = (
            select(Scheme.slug)
            .join(SchemeChunk, SchemeChunk.scheme_id == Scheme.id)
            .order_by(SchemeChunk.embedding.cosine_distance(query_vector))
            .limit(5)
        )
        retrieved_slugs = [slug for slug in db.scalars(stmt).all()]
        
        if expected_slug in retrieved_slugs:
            correct += 1
        else:
            logger.debug(f"RAG Fail: '{question}' -> Expected {expected_slug}, got {retrieved_slugs[:5]}")

    accuracy = (correct / len(data)) * 100
    return accuracy, len(data)


def run_eligibility_eval(db, golden_set_path: Path):
    if not golden_set_path.exists():
        logger.warning(f"Eligibility golden set not found at {golden_set_path}")
        return 0, 0

    with open(golden_set_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    if not data:
        return 0, 0

    correct_outcomes = 0
    total_outcomes = 0
    
    schemes = db.scalars(select(Scheme)).all()
    scheme_dict = {s.slug: s for s in schemes}

    for item in data:
        profile = item["profile"]
        expected_eligible = set(item["expected_eligible_slugs"])
        expected_ineligible = set(item["expected_ineligible_slugs"])
        
        for expected_slug in expected_eligible | expected_ineligible:
            total_outcomes += 1
            if expected_slug not in scheme_dict:
                logger.warning(f"Scheme {expected_slug} not found in DB, skipping.")
                continue
            
            scheme = scheme_dict[expected_slug]
            evaluation = evaluate_scheme(scheme, profile)
            
            # evaluate_scheme returns SchemeEvaluation which is a Pydantic model
            # or a dict? In eligibility.py it returns a dataclass or model.
            # wait, it returns SchemeEvaluation dataclass.
            # Check the status field.
            is_eligible = (evaluation.status == "eligible")
            
            if expected_slug in expected_eligible and is_eligible:
                correct_outcomes += 1
            elif expected_slug in expected_ineligible and not is_eligible:
                correct_outcomes += 1
            else:
                logger.debug(f"Eligibility Fail: Profile {profile} -> Expected eligible={expected_slug in expected_eligible}, Got eligible={is_eligible}")

    accuracy = (correct_outcomes / total_outcomes) * 100 if total_outcomes > 0 else 0
    return accuracy, total_outcomes


def main():
    LOG_DIR.mkdir(parents=True, exist_ok=True)
    
    db = SessionLocal()
    try:
        logger.info("Running RAG Evaluation...")
        rag_acc, rag_total = run_rag_eval(db, DATA_DIR / "rag_golden_set.json")
        logger.info(f"RAG retrieval accuracy: {rag_acc:.2f}% ({rag_total} cases)")

        logger.info("Running Eligibility Evaluation...")
        elig_acc, elig_total = run_eligibility_eval(db, DATA_DIR / "eligibility_golden_set.json")
        logger.info(f"Eligibility engine accuracy: {elig_acc:.2f}% ({elig_total} cases)")
        
        timestamp_str = datetime.now().strftime("%Y%m%d_%H%M%S")
        log_path = LOG_DIR / f"eval_run_{timestamp_str}.json"
        
        result_dict = {
            "timestamp": timestamp_str,
            "rag_accuracy": rag_acc,
            "eligibility_accuracy": elig_acc,
            "total_rag_tests": rag_total,
            "total_elig_tests": elig_total
        }
        
        with open(log_path, "w", encoding="utf-8") as f:
            json.dump(result_dict, f, indent=2)
            
        # Store in DB
        eval_run = EvalRun(
            rag_accuracy=rag_acc,
            eligibility_accuracy=elig_acc,
            total_rag_tests=rag_total,
            total_elig_tests=elig_total,
            log_file_path=str(log_path)
        )
        db.add(eval_run)
        db.commit()
        
        logger.info(f"Report saved to {log_path} and recorded in database.")
        
    finally:
        db.close()


if __name__ == "__main__":
    main()
