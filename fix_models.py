import re

with open('ai-service/app/models.py', 'r', encoding='utf-8') as f:
    text = f.read()

# Add Index import
text = text.replace('from sqlalchemy import String, Integer, DateTime, ForeignKey, Text, Float, JSON', 'from sqlalchemy import String, Integer, DateTime, ForeignKey, Text, Float, JSON, Index')

# Add HNSW index to SchemeChunk
replacement = '''    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    __table_args__ = (
        Index('ix_scheme_chunks_embedding_hnsw', 'embedding', postgresql_using='hnsw', postgresql_with={'m': 16, 'ef_construction': 64}, postgresql_ops={'embedding': 'vector_cosine_ops'}),
    )

    scheme: Mapped["Scheme"] = relationship()'''

text = text.replace('''    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    scheme: Mapped["Scheme"] = relationship()''', replacement)

with open('ai-service/app/models.py', 'w', encoding='utf-8') as f:
    f.write(text)
