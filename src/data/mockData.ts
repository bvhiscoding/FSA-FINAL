export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  sources?: Source[];
  metrics?: MetricData[];
}

export interface Source {
  id: string;
  documentName: string;
  page: number;
  chunk: string;
  relevanceScore: number;
}

export interface MetricData {
  label: string;
  value: string;
  change?: number;
  unit?: string;
}

export interface Document {
  id: string;
  name: string;
  type: "pdf" | "xlsx" | "docx";
  size: string;
  uploadedAt: Date;
  status:
    | "indexed"
    | "processing"
    | "parsing"
    | "ocr"
    | "chunking"
    | "embedding"
    | "error";
  pages?: number;
  chunks?: number;
  company: string;
  year: number;
  quarter?: string;
}

export interface PromptTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  variables: string[];
  outputFormat: string;
  template: string;
  usageCount: number;
}

export interface FinancialMetric {
  id: string;
  group: "income_statement" | "balance_sheet" | "cash_flow" | "ratios";
  label: string;
  value2024: number;
  value2023: number;
  change: number;
  unit: "vnd_bn" | "percent" | "ratio" | "times";
  sourceDoc: string;
  sourcePage: number;
}

// === Mock Chat Messages ===
export const mockMessages: ChatMessage[] = [
  {
    id: "1",
    role: "user",
    content:
      "Phân tích tổng quan tình hình tài chính của DHT năm 2024 so với 2023",
    timestamp: new Date("2024-12-01T09:00:00"),
  },
  {
    id: "2",
    role: "assistant",
    content: `**Phân tích Tổng Quan Tài Chính DHT 2024**

---

#### 🎯 Kết Luận Nhanh
DHT ghi nhận **doanh thu tăng 8.2%** nhưng **lợi nhuận ròng suy giảm 23.4%** trong năm 2024, chủ yếu do áp lực chi phí G&A và chi phí tài chính từ dự án đầu tư mới. Đây là dấu hiệu cần theo dõi cẩn thận.

---

#### 📊 Bảng Số Liệu Chính

| Chỉ tiêu | 2024 (tỷ VND) | 2023 (tỷ VND) | Thay đổi |
|-----------|--------------|--------------|---------|
| Doanh thu thuần | 2,847 | 2,631 | +8.2% |
| Lợi nhuận gộp | 680 | 708 | -3.9% |
| Biên lợi nhuận gộp | 23.9% | 26.9% | -3.0 pp |
| Chi phí G&A | 312 | 198 | +57.6% |
| EBIT | 228 | 374 | -39.0% |
| Lợi nhuận ròng | 187 | 244 | -23.4% |
| EPS (VND) | 4,680 | 6,100 | -23.3% |

---

#### 📈 Nhận Xét Xu Hướng

**Tích cực:**
- Doanh thu duy trì đà tăng trưởng ổn định (+8.2%), thể hiện nhu cầu về dược phẩm tiếp tục mạnh
- Mảng ETC (bệnh viện) tăng trưởng 12.4%, trở thành động lực chính

**Cần chú ý:**
- Biên lợi nhuận gộp thu hẹp 3.0 điểm phần trăm do áp lực giá nguyên vật liệu nhập khẩu
- Chi phí G&A tăng đột biến 57.6% (+114 tỷ) là điểm nghẽn lớn nhất cần làm rõ nguyên nhân

---

#### ⚠️ Rủi Ro Nhận Diện

1. **Rủi ro thanh khoản**: Tiền mặt giảm từ 432 tỷ xuống còn 187 tỷ VND (-56.7%)
2. **Rủi ro đầu tư**: Dự án xây dựng 790 tỷ VND chưa hoàn thành, tạo áp lực lên dòng tiền
3. **Rủi ro tỷ giá**: DHT phụ thuộc nguyên liệu nhập khẩu, biến động USD/VND có thể tác động mạnh

---

#### 📄 Nguồn Tham Chiếu
- BCTC kiểm toán 2024: trang 12-15 (KQKD), trang 23-28 (CĐKT)
- Thuyết minh BCTC: trang 45 (G&A drivers), trang 67 (CIP 790 tỷ)`,
    timestamp: new Date("2024-12-01T09:01:30"),
    sources: [
      {
        id: "s1",
        documentName: "DHT_BCTC_2024_Kiemtoan.pdf",
        page: 12,
        chunk:
          "Doanh thu thuần năm 2024 đạt 2,847 tỷ đồng, tăng 8.2% so với năm 2023 là 2,631 tỷ đồng. Lợi nhuận sau thuế đạt 187 tỷ đồng, giảm 23.4%...",
        relevanceScore: 0.96,
      },
      {
        id: "s2",
        documentName: "DHT_BCTC_2024_Kiemtoan.pdf",
        page: 45,
        chunk:
          "Chi phí quản lý doanh nghiệp năm 2024 là 312 tỷ đồng, tăng 57.6% so với 198 tỷ đồng năm 2023. Nguyên nhân chính do tăng chi phí khấu hao và chi phí nhân sự...",
        relevanceScore: 0.91,
      },
      {
        id: "s3",
        documentName: "DHT_BCTC_2024_Kiemtoan.pdf",
        page: 67,
        chunk:
          "Chi phí xây dựng cơ bản dở dang tại thời điểm 31/12/2024 là 790 tỷ đồng liên quan đến dự án nhà máy sản xuất tại Hà Tây...",
        relevanceScore: 0.88,
      },
    ],
    metrics: [
      { label: "Doanh thu thuần", value: "2,847 tỷ", change: 8.2, unit: "VND" },
      { label: "Lợi nhuận ròng", value: "187 tỷ", change: -23.4, unit: "VND" },
      { label: "Biên LN gộp", value: "23.9%", change: -3.0, unit: "%" },
    ],
  },
  {
    id: "3",
    role: "user",
    content: "Phân tích chi tiết nguyên nhân chi phí G&A tăng 57.6%",
    timestamp: new Date("2024-12-01T09:05:00"),
  },
];

// === Mock Documents ===
export const mockDocuments: Document[] = [
  {
    id: "d1",
    name: "DHT_BCTC_2024_Kiemtoan.pdf",
    type: "pdf",
    size: "4.2 MB",
    uploadedAt: new Date("2024-11-20"),
    status: "indexed",
    pages: 124,
    chunks: 847,
    company: "DHT",
    year: 2024,
  },
  {
    id: "d2",
    name: "DHT_BCTC_2023_Kiemtoan.pdf",
    type: "pdf",
    size: "3.8 MB",
    uploadedAt: new Date("2024-11-20"),
    status: "indexed",
    pages: 118,
    chunks: 792,
    company: "DHT",
    year: 2023,
  },
  {
    id: "d3",
    name: "DHT_ThuyetMinhBCTC_2024.xlsx",
    type: "xlsx",
    size: "1.1 MB",
    uploadedAt: new Date("2024-11-21"),
    status: "indexed",
    pages: 24,
    chunks: 312,
    company: "DHT",
    year: 2024,
  },
  {
    id: "d4",
    name: "DHT_BaoCaoNamThuong_2024.pdf",
    type: "pdf",
    size: "8.7 MB",
    uploadedAt: new Date("2024-11-22"),
    status: "processing",
    pages: 89,
    company: "DHT",
    year: 2024,
  },
  {
    id: "d5",
    name: "DHT_BCTC_Q3_2024.pdf",
    type: "pdf",
    size: "2.1 MB",
    uploadedAt: new Date("2024-11-22"),
    status: "chunking",
    pages: 52,
    company: "DHT",
    year: 2024,
    quarter: "Q3",
  },
];

// === Mock Prompt Templates ===
export const mockPrompts: PromptTemplate[] = [
  {
    id: "p1",
    title: "Phân tích Doanh thu & Tăng trưởng",
    description:
      "Phân tích chi tiết doanh thu theo kênh, sản phẩm và so sánh YoY/QoQ",
    category: "Revenue",
    variables: ["company", "year", "comparison_year"],
    outputFormat: "Bảng số liệu + Nhận xét xu hướng + Rủi ro",
    template:
      "Hãy phân tích chi tiết doanh thu của {company} năm {year} so với {comparison_year}. Bao gồm: (1) Phân tích theo kênh ETC/OTC, (2) Tăng trưởng theo sản phẩm chính, (3) Xu hướng và dự báo.",
    usageCount: 47,
  },
  {
    id: "p2",
    title: "Phân tích Biên Lợi Nhuận",
    description:
      "Deep-dive vào gross margin, EBITDA margin và các thành phần chi phí",
    category: "Profitability",
    variables: ["company", "year"],
    outputFormat: "Bảng margin + Biểu đồ waterfall + Nhận xét",
    template:
      "Phân tích cấu trúc chi phí và biên lợi nhuận của {company} năm {year}. Xác định các yếu tố tác động chính đến biên LN gộp, EBIT và LNST.",
    usageCount: 38,
  },
  {
    id: "p3",
    title: "Phân tích Dòng Tiền",
    description: "Phân tích cash flow từ hoạt động, đầu tư và tài chính",
    category: "Cash Flow",
    variables: ["company", "year"],
    outputFormat: "Bảng LCTT + Nhận xét chất lượng earnings",
    template:
      "Phân tích báo cáo lưu chuyển tiền tệ của {company} năm {year}. Đánh giá chất lượng lợi nhuận thông qua tỷ lệ CFO/LNST, khả năng self-funding và rủi ro thanh khoản.",
    usageCount: 31,
  },
  {
    id: "p4",
    title: "Phân tích Cân Đối Kế Toán",
    description: "Đánh giá cơ cấu tài sản, nguồn vốn và hiệu quả sử dụng vốn",
    category: "Balance Sheet",
    variables: ["company", "year"],
    outputFormat: "Bảng CĐKT phân tích + Chỉ số hiệu quả vốn",
    template:
      "Phân tích bảng cân đối kế toán của {company} tại ngày 31/12/{year}. Đánh giá cơ cấu tài sản-nguồn vốn, working capital cycle, số ngày thu tiền bình quân và hiệu suất sử dụng tổng tài sản.",
    usageCount: 28,
  },
  {
    id: "p5",
    title: "Phân tích Rủi Ro Tài Chính",
    description: "Đánh giá các rủi ro: leverage, tín dụng, thanh khoản, tỷ giá",
    category: "Risk",
    variables: ["company", "year"],
    outputFormat: "Ma trận rủi ro + Điểm rủi ro tổng thể",
    template:
      "Thực hiện đánh giá rủi ro tài chính toàn diện cho {company} năm {year}. Phân tích: rủi ro đòn bẩy (D/E, ICR), rủi ro thanh khoản (current ratio, quick ratio), rủi ro tín dụng và rủi ro thị trường.",
    usageCount: 22,
  },
  {
    id: "p6",
    title: "So Sánh Theo Năm (YoY)",
    description: "So sánh toàn diện các chỉ tiêu tài chính qua nhiều năm",
    category: "Comparison",
    variables: ["company", "start_year", "end_year"],
    outputFormat: "Bảng so sánh đa kỳ + CAGR + Biểu đồ xu hướng",
    template:
      "Thực hiện phân tích Year-over-Year cho {company} từ năm {start_year} đến {end_year}. Tính CAGR cho các chỉ tiêu chính, nhận diện xu hướng dài hạn và các điểm thay đổi quan trọng.",
    usageCount: 19,
  },
];

// === Mock Financial Metrics ===
export const mockMetrics: FinancialMetric[] = [
  // Income Statement
  {
    id: "m1",
    group: "income_statement",
    label: "Doanh thu thuần",
    value2024: 2847,
    value2023: 2631,
    change: 8.2,
    unit: "vnd_bn",
    sourceDoc: "DHT_BCTC_2024.pdf",
    sourcePage: 12,
  },
  {
    id: "m2",
    group: "income_statement",
    label: "Giá vốn hàng bán",
    value2024: 2167,
    value2023: 1923,
    change: 12.7,
    unit: "vnd_bn",
    sourceDoc: "DHT_BCTC_2024.pdf",
    sourcePage: 12,
  },
  {
    id: "m3",
    group: "income_statement",
    label: "Lợi nhuận gộp",
    value2024: 680,
    value2023: 708,
    change: -3.9,
    unit: "vnd_bn",
    sourceDoc: "DHT_BCTC_2024.pdf",
    sourcePage: 12,
  },
  {
    id: "m4",
    group: "income_statement",
    label: "Chi phí bán hàng",
    value2024: 140,
    value2023: 136,
    change: 3.1,
    unit: "vnd_bn",
    sourceDoc: "DHT_BCTC_2024.pdf",
    sourcePage: 13,
  },
  {
    id: "m5",
    group: "income_statement",
    label: "Chi phí G&A",
    value2024: 312,
    value2023: 198,
    change: 57.6,
    unit: "vnd_bn",
    sourceDoc: "DHT_BCTC_2024.pdf",
    sourcePage: 13,
  },
  {
    id: "m6",
    group: "income_statement",
    label: "EBIT",
    value2024: 228,
    value2023: 374,
    change: -39.0,
    unit: "vnd_bn",
    sourceDoc: "DHT_BCTC_2024.pdf",
    sourcePage: 14,
  },
  {
    id: "m7",
    group: "income_statement",
    label: "Lợi nhuận ròng",
    value2024: 187,
    value2023: 244,
    change: -23.4,
    unit: "vnd_bn",
    sourceDoc: "DHT_BCTC_2024.pdf",
    sourcePage: 14,
  },
  // Balance Sheet
  {
    id: "m8",
    group: "balance_sheet",
    label: "Tổng tài sản",
    value2024: 3842,
    value2023: 3127,
    change: 22.9,
    unit: "vnd_bn",
    sourceDoc: "DHT_BCTC_2024.pdf",
    sourcePage: 20,
  },
  {
    id: "m9",
    group: "balance_sheet",
    label: "Tiền & tương đương tiền",
    value2024: 187,
    value2023: 432,
    change: -56.7,
    unit: "vnd_bn",
    sourceDoc: "DHT_BCTC_2024.pdf",
    sourcePage: 21,
  },
  {
    id: "m10",
    group: "balance_sheet",
    label: "Hàng tồn kho",
    value2024: 847,
    value2023: 712,
    change: 19.0,
    unit: "vnd_bn",
    sourceDoc: "DHT_BCTC_2024.pdf",
    sourcePage: 22,
  },
  {
    id: "m11",
    group: "balance_sheet",
    label: "TSCĐ thuần",
    value2024: 1254,
    value2023: 823,
    change: 52.4,
    unit: "vnd_bn",
    sourceDoc: "DHT_BCTC_2024.pdf",
    sourcePage: 23,
  },
  {
    id: "m12",
    group: "balance_sheet",
    label: "CIP (XDCB dở dang)",
    value2024: 790,
    value2023: 124,
    change: 537.1,
    unit: "vnd_bn",
    sourceDoc: "DHT_BCTC_2024.pdf",
    sourcePage: 67,
  },
  {
    id: "m13",
    group: "balance_sheet",
    label: "Nợ vay ngắn hạn",
    value2024: 687,
    value2023: 342,
    change: 100.9,
    unit: "vnd_bn",
    sourceDoc: "DHT_BCTC_2024.pdf",
    sourcePage: 25,
  },
  {
    id: "m14",
    group: "balance_sheet",
    label: "Vốn chủ sở hữu",
    value2024: 2147,
    value2023: 2026,
    change: 6.0,
    unit: "vnd_bn",
    sourceDoc: "DHT_BCTC_2024.pdf",
    sourcePage: 27,
  },
  // Cash Flow
  {
    id: "m15",
    group: "cash_flow",
    label: "CFO",
    value2024: 284,
    value2023: 387,
    change: -26.6,
    unit: "vnd_bn",
    sourceDoc: "DHT_BCTC_2024.pdf",
    sourcePage: 32,
  },
  {
    id: "m16",
    group: "cash_flow",
    label: "CFI",
    value2024: -924,
    value2023: -213,
    change: -333.8,
    unit: "vnd_bn",
    sourceDoc: "DHT_BCTC_2024.pdf",
    sourcePage: 33,
  },
  {
    id: "m17",
    group: "cash_flow",
    label: "CFF",
    value2024: 395,
    value2023: -42,
    change: 1040.5,
    unit: "vnd_bn",
    sourceDoc: "DHT_BCTC_2024.pdf",
    sourcePage: 34,
  },
  {
    id: "m18",
    group: "cash_flow",
    label: "Free Cash Flow",
    value2024: -87,
    value2023: 312,
    change: -127.9,
    unit: "vnd_bn",
    sourceDoc: "DHT_BCTC_2024.pdf",
    sourcePage: 35,
  },
  // Ratios
  {
    id: "m19",
    group: "ratios",
    label: "Biên LN gộp",
    value2024: 23.9,
    value2023: 26.9,
    change: -3.0,
    unit: "percent",
    sourceDoc: "DHT_BCTC_2024.pdf",
    sourcePage: 12,
  },
  {
    id: "m20",
    group: "ratios",
    label: "Biên EBIT",
    value2024: 8.0,
    value2023: 14.2,
    change: -6.2,
    unit: "percent",
    sourceDoc: "DHT_BCTC_2024.pdf",
    sourcePage: 14,
  },
  {
    id: "m21",
    group: "ratios",
    label: "Biên LNST",
    value2024: 6.6,
    value2023: 9.3,
    change: -2.7,
    unit: "percent",
    sourceDoc: "DHT_BCTC_2024.pdf",
    sourcePage: 14,
  },
  {
    id: "m22",
    group: "ratios",
    label: "ROE",
    value2024: 8.7,
    value2023: 12.0,
    change: -3.3,
    unit: "percent",
    sourceDoc: "DHT_BCTC_2024.pdf",
    sourcePage: 40,
  },
  {
    id: "m23",
    group: "ratios",
    label: "ROA",
    value2024: 4.9,
    value2023: 7.8,
    change: -2.9,
    unit: "percent",
    sourceDoc: "DHT_BCTC_2024.pdf",
    sourcePage: 40,
  },
  {
    id: "m24",
    group: "ratios",
    label: "D/E ratio",
    value2024: 0.79,
    value2023: 0.54,
    change: 46.3,
    unit: "ratio",
    sourceDoc: "DHT_BCTC_2024.pdf",
    sourcePage: 42,
  },
  {
    id: "m25",
    group: "ratios",
    label: "Current Ratio",
    value2024: 1.82,
    value2023: 2.34,
    change: -22.2,
    unit: "ratio",
    sourceDoc: "DHT_BCTC_2024.pdf",
    sourcePage: 42,
  },
  {
    id: "m26",
    group: "ratios",
    label: "ICR",
    value2024: 3.2,
    value2023: 8.7,
    change: -63.2,
    unit: "times",
    sourceDoc: "DHT_BCTC_2024.pdf",
    sourcePage: 43,
  },
  {
    id: "m27",
    group: "ratios",
    label: "P/E (trailing)",
    value2024: 12.4,
    value2023: 9.8,
    change: 26.5,
    unit: "times",
    sourceDoc: "DHT_BCTC_2024.pdf",
    sourcePage: 44,
  },
  {
    id: "m28",
    group: "ratios",
    label: "EPS (VND)",
    value2024: 4680,
    value2023: 6100,
    change: -23.3,
    unit: "ratio",
    sourceDoc: "DHT_BCTC_2024.pdf",
    sourcePage: 44,
  },
];
