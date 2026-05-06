# RAG System

FastAPI RAG service with document ingestion, local ChromaDB storage, multilingual embeddings, dotsocr API OCR, and Tesseract OCR.

## Requirements

- Python 3.10+
- Tesseract installed for `ocr_engine=tesseract` or fallback OCR
- Poppler installed for PDF-to-image conversion used by dotsocr and scanned PDFs

Set optional Windows paths in `.env`:

```env
TESSERACT_CMD=C:\Program Files\Tesseract-OCR\tesseract.exe
POPPLER_PATH=C:\poppler\Library\bin
```

## Run

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -e .
copy .env.example .env
python -m uvicorn app.main:app --reload
```

## API

Health:

```powershell
Invoke-RestMethod http://127.0.0.1:8000/health
```

Ingest:

```powershell
curl.exe -F "file=@sample.pdf" -F "ocr_engine=dotsocr" http://127.0.0.1:8000/documents/ingest
```

Query:

```powershell
Invoke-RestMethod http://127.0.0.1:8000/query -Method Post -ContentType "application/json" -Body '{"question":"Nội dung chính là gì?","top_k":5}'
```

`dotsocr` receives images only. PDFs are converted page-by-page to images before OCR.
