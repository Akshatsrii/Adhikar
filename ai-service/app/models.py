from datetime import datetime



from pgvector.sqlalchemy import Vector

from sqlalchemy import JSON, DateTime, Float, ForeignKey, Integer, String, Text, func, Index

from sqlalchemy.orm import Mapped, mapped_column, relationship



from app.database import Base



EMBEDDING_DIM = 768  # Gemini text-embedding-004 output size





class Scheme(Base):

    __tablename__ = "schemes"



    id: Mapped[int] = mapped_column(Integer, primary_key=True)

    slug: Mapped[str] = mapped_column(String(160), unique=True, index=True)

    name: Mapped[str] = mapped_column(String(255))

    department: Mapped[str] = mapped_column(String(255))

    category: Mapped[str] = mapped_column(String(100))

    level: Mapped[str] = mapped_column(String(20))  # "central" | "state"

    state: Mapped[str | None] = mapped_column(String(100), nullable=True)

    benefit: Mapped[str] = mapped_column(Text)

    description: Mapped[str] = mapped_column(Text)

    source_url: Mapped[str] = mapped_column(String(500))

    application_url: Mapped[str | None] = mapped_column(String(500), nullable=True)

    deadline: Mapped[str | None] = mapped_column(String(100), nullable=True)



    # Family Optimizer flags (Stage 6)

    mutually_exclusive_group: Mapped[str | None] = mapped_column(String(100), nullable=True)

    one_per_family: Mapped[bool] = mapped_column(default=False)



    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    updated_at: Mapped[datetime] = mapped_column(

        DateTime, server_default=func.now(), onupdate=func.now()

    )



    eligibility_rules: Mapped[list["EligibilityRule"]] = relationship(

        back_populates="scheme", cascade="all, delete-orphan"

    )

    documents_required: Mapped[list["DocumentRequirement"]] = relationship(

        back_populates="scheme", cascade="all, delete-orphan"

    )





class EligibilityRule(Base):

    __tablename__ = "eligibility_rules"



    id: Mapped[int] = mapped_column(Integer, primary_key=True)

    scheme_id: Mapped[int] = mapped_column(ForeignKey("schemes.id"))



    field: Mapped[str] = mapped_column(String(100))  # e.g. "income", "age", "state"

    operator: Mapped[str] = mapped_column(String(20))  # "<=", ">=", "==", "in"

    value: Mapped[str] = mapped_column(String(255))  # stored as string, cast at eval time



    scheme: Mapped["Scheme"] = relationship(back_populates="eligibility_rules")





class DocumentRequirement(Base):

    __tablename__ = "documents_required"



    id: Mapped[int] = mapped_column(Integer, primary_key=True)

    scheme_id: Mapped[int] = mapped_column(ForeignKey("schemes.id"))



    name: Mapped[str] = mapped_column(String(255))

    is_mandatory: Mapped[bool] = mapped_column(default=True)



    scheme: Mapped["Scheme"] = relationship(back_populates="documents_required")





class Source(Base):

    """Raw source record a scheme was extracted from — kept for auditability

    and for the Regulatory Monitoring Pipeline's change-detection diffing."""



    __tablename__ = "sources"



    id: Mapped[int] = mapped_column(Integer, primary_key=True)

    scheme_id: Mapped[int] = mapped_column(ForeignKey("schemes.id"))



    url: Mapped[str] = mapped_column(String(500))

    fetched_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    content_hash: Mapped[str] = mapped_column(String(64))

    raw_text: Mapped[str] = mapped_column(Text)





class SchemeChunk(Base):

    """A retrievable, embedded text chunk derived from a scheme record.

    This is what the RAG pipeline actually searches over — one scheme can

    produce multiple chunks (overview, eligibility, documents) so retrieval

    stays precise instead of matching on one giant blob per scheme."""



    __tablename__ = "scheme_chunks"



    id: Mapped[int] = mapped_column(Integer, primary_key=True)

    scheme_id: Mapped[int] = mapped_column(ForeignKey("schemes.id"))



    chunk_type: Mapped[str] = mapped_column(String(30))  # "overview" | "eligibility" | "documents"

    content: Mapped[str] = mapped_column(Text)

    embedding: Mapped[list[float]] = mapped_column(Vector(EMBEDDING_DIM))



    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    __table_args__ = (
        Index('ix_scheme_chunks_embedding_hnsw', 'embedding', postgresql_using='hnsw', postgresql_with={'m': 16, 'ef_construction': 64}, postgresql_ops={'embedding': 'vector_cosine_ops'}),
    )

    scheme: Mapped["Scheme"] = relationship()





class SchemeVersion(Base):
    """Immutable snapshot of a scheme's rule-bearing fields at a point in time (Stage 14 version control).
    Every approved regulatory change writes a new row; nothing is ever updated
    in place, so "what changed and when" is always answerable from the table
    itself rather than reconstructed."""
    __tablename__ = "scheme_versions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    scheme_id: Mapped[int] = mapped_column(ForeignKey("schemes.id"), index=True)
    version_number: Mapped[int] = mapped_column(Integer)

    # Full rule-bearing snapshot as JSON � deliberately denormalised so an old
    # version stays readable even after the live rules table moves on.
    snapshot: Mapped[dict] = mapped_column(JSON)
    source_url: Mapped[str] = mapped_column(String(500))
    content_hash: Mapped[str] = mapped_column(String(64))
    authority_level: Mapped[str] = mapped_column(String(30), default="portal")
    published_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    scheme: Mapped["Scheme"] = relationship()


class RegulatoryChange(Base):
    """A detected change awaiting (or having completed) human review.
    Government data is high-stakes, so nothing the pipeline detects reaches
    the live knowledge base automatically � a row sits here in `pending` until
    an admin approves it (Stage 19).
    """
    __tablename__ = "regulatory_changes"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    scheme_id: Mapped[int] = mapped_column(ForeignKey("schemes.id"), index=True)
    change_type: Mapped[str] = mapped_column(String(40))
    field: Mapped[str | None] = mapped_column(String(100), nullable=True)
    old_value: Mapped[str | None] = mapped_column(String(500), nullable=True)
    new_value: Mapped[str | None] = mapped_column(String(500), nullable=True)
    summary: Mapped[str] = mapped_column(Text)
    confidence: Mapped[float] = mapped_column(Float, default=0.0)
    source_url: Mapped[str] = mapped_column(String(500))
    authority_level: Mapped[str] = mapped_column(String(30), default="portal")
    
    # Stage 15 impact analysis output, cached at detection time.
    impact: Mapped[dict | None] = mapped_column(JSON, nullable=True)

    # pending | approved | rejected
    status: Mapped[str] = mapped_column(String(20), default="pending", index=True)
    reviewed_by: Mapped[str | None] = mapped_column(String(120), nullable=True)
    reviewed_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    review_note: Mapped[str | None] = mapped_column(Text, nullable=True)
    detected_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    scheme: Mapped["Scheme"] = relationship()



class EvalRun(Base):
    __tablename__ = "eval_runs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    timestamp: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    rag_accuracy: Mapped[float] = mapped_column(Float)
    eligibility_accuracy: Mapped[float] = mapped_column(Float)
    total_rag_tests: Mapped[int] = mapped_column(Integer)
    total_elig_tests: Mapped[int] = mapped_column(Integer)
    log_file_path: Mapped[str] = mapped_column(String(500))
