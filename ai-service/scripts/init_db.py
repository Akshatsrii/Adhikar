import sys
from pathlib import Path
from sqlalchemy import text

# Add project root to path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.database import Base, engine
import app.models

def init_db():
    with engine.begin() as conn:
        conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector"))
    Base.metadata.create_all(bind=engine)
    print("Database initialized.")

if __name__ == "__main__":
    init_db()
