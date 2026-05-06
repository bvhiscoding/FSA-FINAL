import re
import sqlite3
from pathlib import Path
from urllib.parse import quote

from app.config import Settings


class StockDataService:
    def __init__(self, settings: Settings) -> None:
        self.db_path = settings.stocks_db_path

    def _connect(self) -> sqlite3.Connection:
        uri = f"file:{quote(str(self.db_path), safe=':/')}?mode=ro"
        connection = sqlite3.connect(uri, uri=True, timeout=10)
        connection.row_factory = sqlite3.Row
        return connection

    def is_available(self) -> bool:
        return Path(self.db_path).exists()

    def normalize_ticker(self, ticker: str) -> str:
        return ticker.strip().upper()

    def extract_ticker(self, question: str) -> str | None:
        candidates = re.findall(r"\b[A-Z]{2,5}\b", question.upper())
        for candidate in candidates:
            if self.ticker_exists(candidate):
                return candidate
        return None

    def ticker_exists(self, ticker: str) -> bool:
        ticker = self.normalize_ticker(ticker)
        if not self.is_available():
            return False
        with self._connect() as connection:
            row = connection.execute("select 1 from stocks where ticker = ? limit 1", (ticker,)).fetchone()
        return row is not None

    def get_company_summary(self, ticker: str) -> dict | None:
        ticker = self.normalize_ticker(ticker)
        if not self.is_available():
            return None
        with self._connect() as connection:
            stock = connection.execute(
                """
                select ticker, organ_name, en_organ_name, organ_short_name, status, listed_date, company_id, tax_code, isin
                from stocks
                where ticker = ?
                limit 1
                """,
                (ticker,),
            ).fetchone()
            overview = connection.execute(
                "select * from company_overview where symbol = ? limit 1",
                (ticker,),
            ).fetchone()
        if not stock:
            return None
        return {
            "stock": dict(stock),
            "overview": dict(overview) if overview else None,
        }

    def get_latest_financials(self, ticker: str, limit: int = 8) -> dict:
        ticker = self.normalize_ticker(ticker)
        limit = max(1, min(limit, 20))
        if not self.is_available():
            return {"ticker": ticker, "income_statement": [], "balance_sheet": [], "cash_flow_statement": [], "financial_ratios": []}
        with self._connect() as connection:
            return {
                "ticker": ticker,
                "income_statement": self._query_table(
                    connection,
                    "income_statement",
                    "symbol, period, year, quarter, revenue, gross_profit, operating_profit, profit_before_tax, net_profit, eps, source, updated_at",
                    ticker,
                    limit,
                ),
                "balance_sheet": self._query_table(
                    connection,
                    "balance_sheet",
                    "symbol, period, year, quarter, asset_current, total_assets, liabilities_total, equity_total, share_capital, retained_earnings, source, updated_at",
                    ticker,
                    limit,
                ),
                "cash_flow_statement": self._query_table(
                    connection,
                    "cash_flow_statement",
                    "symbol, period, year, quarter, net_cash_from_operating_activities, net_cash_from_investing_activities, net_cash_from_financing_activities, net_cash_flow_period, cash_and_cash_equivalents_beginning, cash_and_cash_equivalents_ending, source, updated_at",
                    ticker,
                    limit,
                ),
                "financial_ratios": self._query_table(
                    connection,
                    "financial_ratios",
                    "symbol, period, year, quarter, price_to_earnings, price_to_book, price_to_sales, eps_vnd, roe, roa, gross_margin, net_profit_margin, debt_to_equity, current_ratio, market_cap_billions, source, updated_at",
                    ticker,
                    limit,
                ),
            }

    def get_price_snapshot(self, ticker: str) -> dict | None:
        ticker = self.normalize_ticker(ticker)
        if not self.is_available():
            return None
        with self._connect() as connection:
            row = connection.execute(
                """
                select symbol, time, open, high, low, close, volume
                from stock_price_history
                where symbol = ?
                order by time desc
                limit 1
                """,
                (ticker,),
            ).fetchone()
        return dict(row) if row else None

    def build_structured_context(self, question: str, ticker: str | None = None) -> tuple[str | None, str | None]:
        resolved_ticker = self.normalize_ticker(ticker) if ticker else self.extract_ticker(question)
        if not resolved_ticker or not self.ticker_exists(resolved_ticker):
            return None, None

        summary = self.get_company_summary(resolved_ticker)
        financials = self.get_latest_financials(resolved_ticker, limit=6)
        price = self.get_price_snapshot(resolved_ticker)

        lines = [f"Ticker: {resolved_ticker}", "Source: vietnam_stocks.db (VCI-updated structured SQLite database)"]
        if summary:
            stock = summary["stock"]
            lines.append(f"Company: {stock.get('organ_name') or stock.get('organ_short_name') or resolved_ticker}")
            if stock.get("listed_date"):
                lines.append(f"Listed date: {stock['listed_date']}")
        if price:
            lines.append(f"Latest price: close={price.get('close')}, volume={price.get('volume')}, time={price.get('time')} (table stock_price_history)")

        table_labels = {
            "income_statement": "Income statement",
            "balance_sheet": "Balance sheet",
            "cash_flow_statement": "Cash flow",
            "financial_ratios": "Financial ratios",
        }
        for table, label in table_labels.items():
            rows = financials.get(table, [])
            if not rows:
                continue
            lines.append(f"\n{label} (table {table}, latest {len(rows)} records):")
            for row in rows[:4]:
                period = f"{row.get('year')}Q{row.get('quarter')}" if row.get("quarter") else str(row.get("year") or row.get("period"))
                metrics = ", ".join(
                    f"{key}={value}"
                    for key, value in row.items()
                    if key not in {"symbol", "period", "year", "quarter", "source", "updated_at"} and value is not None
                )
                lines.append(f"- {period}: {metrics}")

        return "\n".join(lines).strip(), resolved_ticker

    def _query_table(self, connection: sqlite3.Connection, table: str, columns: str, ticker: str, limit: int) -> list[dict]:
        rows = connection.execute(
            f"select {columns} from {table} where symbol = ? order by year desc, quarter desc limit ?",
            (ticker, limit),
        ).fetchall()
        return [dict(row) for row in rows]
