import sys
import json
from pathlib import Path

# Add project root to path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.database import SessionLocal
from app.models import Scheme, EligibilityRule, SchemeChunk, DocumentRequirement
from app.gemini import embed_text
from app.config import settings

def safe_embed_text(text: str, task_type: str = "RETRIEVAL_DOCUMENT") -> list[float]:
    if not settings.gemini_api_key:
        return [0.0] * 768
    return embed_text(text, task_type=task_type)

def seed_schemes():
    db = SessionLocal()
    
    if db.query(Scheme).first():
        print("Database already seeded. Skipping.")
        db.close()
        return
    
    seed_file = Path(__file__).resolve().parent.parent / "data" / "schemes_seed.json"
    if not seed_file.exists():
        print(f"Error: Could not find {seed_file}")
        db.close()
        return

    with open(seed_file, 'r', encoding='utf-8') as f:
        schemes_data = json.load(f)

    for item in schemes_data:
        scheme = Scheme(
            slug=item.get("slug"),
            name=item.get("name"),
            department=item.get("department"),
            category=item.get("category"),
            level=item.get("level"),
            state=item.get("state"),
            benefit=item.get("benefit"),
            description=item.get("description"),
            source_url=item.get("source_url")
        )
        db.add(scheme)
        db.commit()

        for rule in item.get("eligibility_rules", []):
            db.add(EligibilityRule(
                scheme_id=scheme.id, 
                field=rule.get("field"), 
                operator=rule.get("operator"), 
                value=str(rule.get("value"))
            ))
            
        docs = item.get("documents_required", [])
        for doc in docs:
            db.add(DocumentRequirement(
                scheme_id=scheme.id,
                name=doc.get("name"),
                is_mandatory=doc.get("is_mandatory", True)
            ))

        chunk_content = f"{item.get('name')} provides {item.get('benefit')}. {item.get('description')}"
        scheme_chunk = SchemeChunk(
            scheme_id=scheme.id,
            chunk_type="overview",
            content=chunk_content,
            embedding=safe_embed_text(chunk_content, task_type="RETRIEVAL_DOCUMENT")
        )
        db.add(scheme_chunk)
        
        if docs:
            doc_names = [d.get("name") for d in docs]
            docs_content = f"Documents required for {item.get('name')}: {', '.join(doc_names)}."
            docs_chunk = SchemeChunk(
                scheme_id=scheme.id,
                chunk_type="documents",
                content=docs_content,
                embedding=safe_embed_text(docs_content, task_type="RETRIEVAL_DOCUMENT")
            )
            db.add(docs_chunk)

    db.commit()
    db.close()
    print("Database seeded with schemes from data/schemes_seed.json.")

if __name__ == "__main__":
    seed_schemes()
