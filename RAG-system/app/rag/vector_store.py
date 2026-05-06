from collections import defaultdict

import chromadb
from chromadb.config import Settings as ChromaSettings

from app.config import Settings
from app.models import ChunkMetadata, DocumentSummary, RetrievedChunk


class VectorStore:
    def __init__(self, settings: Settings) -> None:
        self.client = chromadb.PersistentClient(
            path=str(settings.chroma_dir),
            settings=ChromaSettings(anonymized_telemetry=False),
        )
        self.collection = self.client.get_or_create_collection(name="documents", metadata={"hnsw:space": "cosine"})

    def upsert_chunks(self, chunks: list[tuple[str, ChunkMetadata]], embeddings: list[list[float]]) -> None:
        if not chunks:
            return
        ids = [f"{metadata.document_id}:{metadata.chunk_index}" for _, metadata in chunks]
        documents = [text for text, _ in chunks]
        metadatas = [_chroma_metadata(metadata) for _, metadata in chunks]
        self.collection.upsert(ids=ids, documents=documents, embeddings=embeddings, metadatas=metadatas)

    def query(self, query_embedding: list[float], top_k: int) -> list[RetrievedChunk]:
        results = self.collection.query(query_embeddings=[query_embedding], n_results=top_k, include=["documents", "metadatas", "distances"])
        chunks = []
        for text, metadata, distance in zip(
            results.get("documents", [[]])[0],
            results.get("metadatas", [[]])[0],
            results.get("distances", [[]])[0],
        ):
            score = 1 - distance if distance is not None else None
            chunks.append(RetrievedChunk(text=text, score=score, metadata=ChunkMetadata(**metadata)))
        return chunks

    def list_documents(self) -> list[DocumentSummary]:
        data = self.collection.get(include=["metadatas"])
        grouped: dict[str, dict] = defaultdict(lambda: {"chunks": 0})
        for metadata in data.get("metadatas", []):
            document_id = metadata["document_id"]
            grouped[document_id].update(
                document_id=document_id,
                filename=metadata["filename"],
                mimetype=metadata["mimetype"],
            )
            grouped[document_id]["chunks"] += 1
        return [DocumentSummary(**item) for item in grouped.values()]

    def delete_document(self, document_id: str) -> int:
        existing = self.collection.get(where={"document_id": document_id})
        ids = existing.get("ids", [])
        if ids:
            self.collection.delete(ids=ids)
        return len(ids)


def _chroma_metadata(metadata: ChunkMetadata) -> dict:
    return {key: value for key, value in metadata.model_dump().items() if value is not None}
