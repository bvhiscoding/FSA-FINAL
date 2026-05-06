import httpx
from fastapi import UploadFile

from app.config import Settings
from app.models import IngestResponse, OcrEngineName, QueryResponse
from app.ocr.service import OcrService
from app.processing.chunking import chunk_text
from app.processing.converters import extract_pages, save_upload, write_parsed_output
from app.rag.embeddings import EmbeddingService
from app.rag.vector_store import VectorStore
from app.rag.generator import LLMGenerator
from app.rag.reranker import RerankerService


class RagService:
    def __init__(self, settings: Settings) -> None:
        self.settings = settings
        self.ocr_service = OcrService(settings)
        self.embeddings = EmbeddingService()
        self.vector_store = VectorStore(settings)
        self.generator = LLMGenerator(settings)
        self.reranker = RerankerService()

    async def _emit_status(self, callback_url: str, payload: dict) -> None:
        if not callback_url:
            return
        try:
            async with httpx.AsyncClient(timeout=10) as client:
                await client.post(callback_url, json=payload)
        except Exception as exc:
            print(f"Status callback failed: {exc}")

    async def ingest_file(self, file: UploadFile, ocr_engine: OcrEngineName, language: str, callback_url: str = "") -> IngestResponse:
        await self._emit_status(callback_url, {"status": "parsing"})
        saved_path = await save_upload(file, self.settings.upload_dir)

        await self._emit_status(callback_url, {"status": "ocr"})
        document_id, filename, mimetype, pages = await extract_pages(
            saved_path,
            self.settings,
            self.ocr_service,
            ocr_engine,
            language,
        )

        engine_used = next((page.get("ocr_engine") for page in pages if page.get("ocr_engine")), None)
        parsed_path, parsed_preview = write_parsed_output(self.settings.parsed_dir, document_id, pages)

        await self._emit_status(callback_url, {"status": "chunking", "pages": len(pages), "ocrEngine": engine_used})
        chunks = []
        for page in pages:
            chunks.extend(
                chunk_text(
                    text=page["text"],
                    document_id=document_id,
                    filename=filename,
                    mimetype=mimetype,
                    page=page.get("page"),
                    ocr_engine=page.get("ocr_engine"),
                )
            )

        await self._emit_status(callback_url, {"status": "embedding", "chunks": len(chunks)})
        vectors = self.embeddings.embed_texts([text for text, _ in chunks]) if chunks else []
        self.vector_store.upsert_chunks(chunks, vectors)

        await self._emit_status(
            callback_url,
            {
                "status": "indexed",
                "pages": len(pages),
                "chunks": len(chunks),
                "parsedPath": str(parsed_path),
                "parsedPreview": parsed_preview,
                "ocrEngine": engine_used,
            },
        )
        return IngestResponse(
            document_id=document_id,
            filename=filename,
            mimetype=mimetype,
            chunks=len(chunks),
            pages=len(pages),
            ocr_engine=engine_used,
            parsed_path=str(parsed_path),
            parsed_preview=parsed_preview,
        )

    def query(self, question: str, top_k: int) -> QueryResponse:
        # 1. Retrieve top 10 chunks from VectorDB
        query_vector = self.embeddings.embed_query(question)
        retrieved_contexts = self.vector_store.query(query_vector, max(top_k * 2, 10))
        
        # 2. Rerank to get top_k
        best_contexts = self.reranker.rerank(question, retrieved_contexts, top_k)
        
        # 3. Generate answer using LLM
        if not best_contexts:
            answer = "No relevant context found in the documents."
        else:
            answer = self.generator.generate(question, best_contexts)
            
        return QueryResponse(question=question, answer=answer, contexts=best_contexts)
