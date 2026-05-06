from pathlib import Path
from typing import Protocol


class OcrEngine(Protocol):
    name: str

    async def extract_text_from_image(self, image_path: Path, language: str = "vie+eng") -> str:
        ...
