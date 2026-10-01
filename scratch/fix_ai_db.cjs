const fs = require('fs');
let code = fs.readFileSync('ai-service/app/main.py', 'utf-8');
const newStartup = `
@app.on_event("startup")
def on_startup() -> None:
    try:
        from sqlalchemy import text
        with engine.begin() as conn:
            conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector;"))

        # Stage 2: plain table creation is enough. Swap for Alembic migrations
        # once the schema needs versioned, production-safe changes.
        Base.metadata.create_all(bind=engine)
        print("Successfully connected to Postgres and initialized pgvector.")
    except Exception as e:
        print(f"WARNING: Could not connect to Postgres DB on startup. Some AI features will be degraded. Error: {e}")
`;
code = code.replace(/@app\.on_event\("startup"\)[\s\S]*?Base\.metadata\.create_all\(bind=engine\)/, newStartup.trim());
fs.writeFileSync('ai-service/app/main.py', code);
