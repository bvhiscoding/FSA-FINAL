from functools import lru_cache
from pathlib import Path

import pytesseract
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

PROJECT_ROOT = Path(__file__).resolve().parents[1]


class Settings(BaseSettings):
    dotsocr_base_url: str = "https://jugate-precious-interveinal.ngrok-free.dev/v1"
    dotsocr_model: str = "rednote-hilab/dots.ocr"
    llm_base_url: str = "https://inspirative-separately-earlean.ngrok-free.dev/v1"
    llm_model: str = "qwen3.5:9b"
    ocr_engine: str = "auto"
    ocr_concurrency: int = 5
    tesseract_cmd: str = ""
    poppler_path: str = ""
    embedding_model: str = "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
    chroma_dir: Path = Field(default=Path("./storage/chroma"))
    upload_dir: Path = Field(default=Path("./storage/uploads"))
    parsed_dir: Path = Field(default=Path("./storage/parsed"))
    stocks_db_path: Path = Field(default=Path("C:/Users/Admin/Desktop/FSA/vietnam_stocks.db"))

    model_config = SettingsConfigDict(env_file=PROJECT_ROOT / ".env", env_file_encoding="utf-8")

    def apply_runtime_config(self) -> None:
        if not self.chroma_dir.is_absolute():
            self.chroma_dir = PROJECT_ROOT / self.chroma_dir
        if not self.upload_dir.is_absolute():
            self.upload_dir = PROJECT_ROOT / self.upload_dir
        if not self.parsed_dir.is_absolute():
            self.parsed_dir = PROJECT_ROOT / self.parsed_dir
        if not self.stocks_db_path.is_absolute():
            self.stocks_db_path = PROJECT_ROOT / self.stocks_db_path

        self.chroma_dir.mkdir(parents=True, exist_ok=True)
        self.upload_dir.mkdir(parents=True, exist_ok=True)
        self.parsed_dir.mkdir(parents=True, exist_ok=True)
        if self.tesseract_cmd:
            pytesseract.pytesseract.tesseract_cmd = self.tesseract_cmd


@lru_cache
def get_settings() -> Settings:
    settings = Settings()
    settings.apply_runtime_config()
    return settings
