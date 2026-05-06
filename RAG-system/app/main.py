from functools import lru_cache

from fastapi import FastAPI, File, Form, HTTPException, UploadFile

from app.config import get_settings
from app.models import DocumentSummary, IngestResponse, OcrEngineName, QueryRequest, QueryResponse
from app.ocr.tesseract import TesseractOcrEngine
from app.rag.service import RagService

app = FastAPI(title="RAG System", version="0.1.0")


@lru_cache
def get_rag_service() -> RagService:
    return RagService(get_settings())


@app.get("/health")
async def health() -> dict:
    settings = get_settings()
    tesseract_available = TesseractOcrEngine(settings.tesseract_cmd).is_available()
    dotsocr_status = "unknown"
    try:
        await get_rag_service().ocr_service.dotsocr.list_models()
        dotsocr_status = "ok"
    except Exception as exc:
        dotsocr_status = f"error: {exc}"
    return {
        "status": "ok",
        "embedding_model": settings.embedding_model,
        "ocr_engine": settings.ocr_engine,
        "dotsocr": dotsocr_status,
        "tesseract_available": tesseract_available,
    }


@app.post("/documents/ingest", response_model=IngestResponse)
async def ingest_document(
    file: UploadFile = File(...),
    ocr_engine: OcrEngineName = Form("auto"),
    language: str = Form("vie+eng"),
    callback_url: str = Form(""),
) -> IngestResponse:
    try:
        return await get_rag_service().ingest_file(file, ocr_engine, language, callback_url)
    except Exception as exc:
        if callback_url:
            await get_rag_service()._emit_status(callback_url, {"status": "error", "errorMessage": str(exc)})
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@app.post("/query", response_model=QueryResponse)
def query(request: QueryRequest) -> QueryResponse:
    try:
        return get_rag_service().query(request.question, request.top_k)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@app.get("/documents", response_model=list[DocumentSummary])
def list_documents() -> list[DocumentSummary]:
    return get_rag_service().vector_store.list_documents()


@app.delete("/documents/{document_id}")
def delete_document(document_id: str) -> dict:
    deleted = get_rag_service().vector_store.delete_document(document_id)
    return {"document_id": document_id, "deleted_chunks": deleted}


def main() -> None:
    import uvicorn

    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
