from pathlib import Path

import pytesseract


class TesseractOcrEngine:
    name = "tesseract"

    def __init__(self, command: str = "") -> None:
        if command:
            pytesseract.pytesseract.tesseract_cmd = command

    async def extract_text_from_image(self, image_path: Path, language: str = "vie+eng") -> str:
        return pytesseract.image_to_string(str(image_path), lang=language).strip()

    def is_available(self) -> bool:
        try:
            pytesseract.get_tesseract_version()
            return True
        except Exception:
            return False
