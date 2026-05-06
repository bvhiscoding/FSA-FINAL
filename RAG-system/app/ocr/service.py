from pathlib import Path

from app.config import Settings
from app.models import OcrEngineName
from app.ocr.dotsocr import DotsOcrEngine
from app.ocr.tesseract import TesseractOcrEngine


class OcrService:
    def __init__(self, settings: Settings) -> None:
        self.settings = settings
        self.dotsocr = DotsOcrEngine(settings.dotsocr_base_url, settings.dotsocr_model)
        self.tesseract = TesseractOcrEngine(settings.tesseract_cmd)

    async def extract_text(self, image_path: Path, engine: OcrEngineName, language: str, markdown: bool = False) -> tuple[str, str | None]:
        selected = engine if engine != "auto" else self.settings.ocr_engine
        if selected == "none":
            return "", None
        if selected == "dotsocr":
            return await self.dotsocr.extract_text_from_image(image_path, language, markdown), "dotsocr"
        if selected == "tesseract":
            return await self.tesseract.extract_text_from_image(image_path, language), "tesseract"

        try:
            return await self.dotsocr.extract_text_from_image(image_path, language, markdown), "dotsocr"
        except Exception:
            return await self.tesseract.extract_text_from_image(image_path, language), "tesseract"
