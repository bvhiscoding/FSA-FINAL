from app.models import ChunkMetadata


def chunk_text(
    text: str,
    document_id: str,
    filename: str,
    mimetype: str,
    page: int | None,
    ocr_engine: str | None,
    chunk_size: int = 900,
    overlap: int = 150,
) -> list[tuple[str, ChunkMetadata]]:
    normalized = "\n".join(line.rstrip() for line in text.splitlines()).strip()
    if not normalized:
        return []

    chunks: list[tuple[str, ChunkMetadata]] = []
    start = 0
    while start < len(normalized):
        end = min(start + chunk_size, len(normalized))
        chunk = normalized[start:end].strip()
        if chunk:
            chunks.append(
                (
                    chunk,
                    ChunkMetadata(
                        document_id=document_id,
                        filename=filename,
                        mimetype=mimetype,
                        page=page,
                        chunk_index=len(chunks),
                        ocr_engine=ocr_engine,
                    ),
                )
            )
        if end == len(normalized):
            break
        start = max(end - overlap, start + 1)
    return chunks
