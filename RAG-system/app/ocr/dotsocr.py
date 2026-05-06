import asyncio
import base64
import io
from pathlib import Path

import httpx
from PIL import Image


class DotsOcrEngine:
    name = "dotsocr"

    def __init__(self, base_url: str, model: str) -> None:
        self.base_url = base_url.rstrip("/")
        self.model = model

    async def list_models(self) -> dict:
        async with httpx.AsyncClient(timeout=15) as client:
            response = await client.get(
                f"{self.base_url}/models",
                headers={"ngrok-skip-browser-warning": "true"},
            )
            response.raise_for_status()
            return response.json()

    async def extract_text_from_image(self, image_path: Path, language: str = "vie+eng", markdown: bool = False) -> str:
        image_b64 = _encode_image(image_path)
        media_type = "image/jpeg"
        prompt = (
            "Extract all text from this document page. Preserve headings, paragraphs, tables, and line breaks as Markdown. Return only the Markdown content."
            if markdown
            else f"Extract all readable text from this document image. Language hint: {language}. Return raw text only."
        )
        payload = {
            "model": self.model,
            "messages": [
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": prompt},
                        {
                            "type": "image_url",
                            "image_url": {"url": f"data:{media_type};base64,{image_b64}"},
                        },
                    ],
                }
            ],
            "temperature": 0,
            "max_tokens": 4096,
        }

        last_error: Exception | None = None
        for attempt in range(6):
            try:
                async with httpx.AsyncClient(timeout=240) as client:
                    response = await client.post(
                        f"{self.base_url}/chat/completions",
                        json=payload,
                        headers={"ngrok-skip-browser-warning": "true"},
                    )
                    response.raise_for_status()
                    data = response.json()
                return data["choices"][0]["message"]["content"].strip()
            except Exception as exc:
                last_error = exc
                if attempt < 5:
                    await asyncio.sleep(10)
        raise RuntimeError(f"dotsOCR request failed after retries: {last_error}")


def _encode_image(path: Path, max_side: int = 1600) -> str:
    with Image.open(path) as image:
        image = image.convert("RGB")
        image.thumbnail((max_side, max_side))
        buffer = io.BytesIO()
        image.save(buffer, format="JPEG", quality=85, optimize=True)
    return base64.b64encode(buffer.getvalue()).decode("ascii")
