import httpx
from typing import List
from app.config import Settings
from app.models import RetrievedChunk

class LLMGenerator:
    def __init__(self, settings: Settings):
        self.settings = settings
        self.api_url = f"{settings.llm_base_url}/chat/completions"
        self.model = settings.llm_model

    def generate(self, question: str, contexts: List[RetrievedChunk], structured_context: str | None = None) -> str:
        context_blocks = []
        for index, chunk in enumerate(contexts, start=1):
            metadata = chunk.metadata
            source = f"Source: {metadata.filename}, page {metadata.page or 'unknown'}, chunk {metadata.chunk_index}"
            context_blocks.append(f"--- Context {index} ---\n{source}\n{chunk.text}")
        document_context = "\n\n".join(context_blocks) or "No relevant document RAG context found."
        structured_block = structured_context or "No structured financial database context found."

        system_prompt = (
            "You are an expert financial analyst. Use the provided contexts to answer the user's question accurately. "
            "Prefer the structured financial database for numeric financial facts, periods, ratios, and latest price data. "
            "Use document RAG context for narrative explanations, notes, and supporting evidence. "
            "If the answer is not contained in either source, say you do not have enough information. "
            "Always cite sources using table names or document context labels when possible."
        )

        user_prompt = (
            f"Structured Financial Database Context:\n{structured_block}\n\n"
            f"Document RAG Context:\n{document_context}\n\n"
            f"Question: {question}"
        )

        payload = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            "temperature": 0.1,
        }

        try:
            with httpx.Client(timeout=300.0) as client:
                response = client.post(
                    self.api_url,
                    json=payload,
                    headers={"ngrok-skip-browser-warning": "true"},
                )
                response.raise_for_status()
                data = response.json()
                return data["choices"][0]["message"]["content"]
        except Exception as e:
            print(f"LLM Generation Error: {e}")
            # Fallback to simple concatenation if LLM fails
            raw_document_context = "\n\n".join(chunk.text for chunk in contexts[:3])
            return "Error calling LLM. Raw context:\n" + "\n\n".join(filter(None, [structured_context, raw_document_context]))
