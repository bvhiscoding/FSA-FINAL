from typing import Literal

from pydantic import BaseModel, Field


OcrEngineName = Literal["auto", "dotsocr", "tesseract", "none"]


class ChunkMetadata(BaseModel):
    document_id: str
    filename: str
    mimetype: str
    page: int | None = None
    chunk_index: int
    ocr_engine: str | None = None


class IngestResponse(BaseModel):
    document_id: str
    filename: str
    mimetype: str
    chunks: int
    pages: int | None = None
    ocr_engine: str | None = None
    parsed_path: str | None = None
    parsed_preview: str | None = None


class QueryRequest(BaseModel):
    question: str = Field(min_length=1)
    top_k: int = Field(default=5, ge=1, le=20)
    ticker: str | None = None
    include_structured: bool = True


class RetrievedChunk(BaseModel):
    text: str
    score: float | None = None
    metadata: ChunkMetadata


class QueryResponse(BaseModel):
    question: str
    answer: str
    contexts: list[RetrievedChunk]
    structured_context: str | None = None
    ticker: str | None = None


class DocumentSummary(BaseModel):
    document_id: str
    filename: str
    mimetype: str
    chunks: int
