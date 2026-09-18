
class EvalRun(Base):
    __tablename__ = "eval_runs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    timestamp: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    rag_accuracy: Mapped[float] = mapped_column(Float)
    eligibility_accuracy: Mapped[float] = mapped_column(Float)
    total_rag_tests: Mapped[int] = mapped_column(Integer)
    total_elig_tests: Mapped[int] = mapped_column(Integer)
    log_file_path: Mapped[str] = mapped_column(String(500))
