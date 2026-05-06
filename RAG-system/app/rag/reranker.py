from typing import List
from app.models import RetrievedChunk
import logging

logger = logging.getLogger(__name__)

class RerankerService:
    def __init__(self, model_name: str = "cross-encoder/ms-marco-MiniLM-L-6-v2"):
        self.model_name = model_name
        self.model = None
        self._initialized = False

    def _initialize(self):
        if not self._initialized:
            try:
                from sentence_transformers import CrossEncoder
                self.model = CrossEncoder(self.model_name, max_length=512)
                self._initialized = True
            except Exception as e:
                logger.warning(f"Failed to load CrossEncoder {self.model_name}: {e}")

    def rerank(self, question: str, chunks: List[RetrievedChunk], top_k: int = 3) -> List[RetrievedChunk]:
        if not chunks:
            return []
            
        self._initialize()
        
        if not self.model:
            # Fallback to original order
            return chunks[:top_k]
            
        try:
            # Prepare pairs of (query, document)
            pairs = [[question, chunk.text] for chunk in chunks]
            
            # Predict scores
            scores = self.model.predict(pairs)
            
            # Combine chunks with scores and sort
            scored_chunks = list(zip(chunks, scores))
            scored_chunks.sort(key=lambda x: x[1], reverse=True)
            
            # Return top-k chunks
            return [chunk for chunk, score in scored_chunks[:top_k]]
            
        except Exception as e:
            logger.error(f"Error during reranking: {e}")
            return chunks[:top_k]
