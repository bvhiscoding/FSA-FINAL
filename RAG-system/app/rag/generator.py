import httpx
from typing import List
from app.config import Settings
from app.models import RetrievedChunk

class LLMGenerator:
    def __init__(self, settings: Settings):
        self.settings = settings
        self.api_url = f"{settings.llm_base_url}/chat/completions"
        self.model = settings.llm_model

    def generate(self, question: str, contexts: List[RetrievedChunk]) -> str:
        # Build prompt
        context_str = "\n\n".join([f"--- Context {i+1} ---\n{chunk.text}" for i, chunk in enumerate(contexts)])
        
        system_prompt = (
            "You are an expert financial analyst. Use the provided contexts to answer the user's question accurately. "
            "If the answer is not contained in the contexts, say you do not have enough information. "
            "Always cite your sources if possible based on the context."
        )
        
        user_prompt = f"Context Information:\n{context_str}\n\nQuestion: {question}"

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
            return "Error calling LLM. Raw context:\n" + "\n\n".join(chunk.text for chunk in contexts[:3])
