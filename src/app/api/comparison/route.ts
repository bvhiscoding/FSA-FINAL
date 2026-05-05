import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const body = await req.json();
    const { mode, companies, years } = body;

    // TODO: In a real app, query the database for the selected companies and years.
    // For now, return a mock response that matches the static UI.
    
    const comparisonData = [
      { name: "Doanh thu", "DHT 2024": 2847, "DHT 2023": 2631 },
      { name: "LN Gộp", "DHT 2024": 680, "DHT 2023": 708 },
      { name: "Chi phí G&A", "DHT 2024": 312, "DHT 2023": 198 },
      { name: "EBIT", "DHT 2024": 228, "DHT 2023": 374 },
      { name: "LN Ròng", "DHT 2024": 187, "DHT 2023": 244 },
    ];
    
    const radarData = [
      { subject: "Thanh khoản", "DHT 2024": 40, "DHT 2023": 80 },
      { subject: "Sinh lời", "DHT 2024": 60, "DHT 2023": 75 },
      { subject: "Đòn bẩy", "DHT 2024": 50, "DHT 2023": 30 },
      { subject: "Hiệu quả", "DHT 2024": 70, "DHT 2023": 75 },
      { subject: "Tăng trưởng", "DHT 2024": 55, "DHT 2023": 65 },
    ];
    
    const mockComparisonMetrics = [
      { label: "Doanh thu thuần", v1: "2,847 tỷ", v2: "2,631 tỷ", change: 8.2 },
      { label: "Lợi nhuận ròng", v1: "187 tỷ", v2: "244 tỷ", change: -23.4 },
      { label: "Biên LN gộp", v1: "23.9%", v2: "26.9%", change: -3.0 },
      { label: "ROE", v1: "8.7%", v2: "12.0%", change: -3.3 },
      { label: "D/E ratio", v1: "0.79x", v2: "0.54x", change: 46.3 },
      { label: "Current Ratio", v1: "1.82x", v2: "2.34x", change: -22.2 },
    ];

    const aiInsights = [
      "Tăng trưởng top-line đi kèm suy giảm sinh lời: Dù doanh thu tăng trưởng 8.2%, lợi nhuận ròng lại suy giảm mạnh 23.4% so với 2023. Biên lợi nhuận gộp thu hẹp từ 26.9% xuống 23.9% cho thấy sức ép lớn từ giá vốn.",
      "Rủi ro đòn bẩy và thanh khoản: D/E ratio tăng đáng kể từ 0.54x lên 0.79x, trong khi Current Ratio giảm từ 2.34x xuống 1.82x, phản ánh gánh nặng nợ vay ngắn hạn để tài trợ dự án xây dựng cơ bản dở dang (CIP)."
    ];

    return NextResponse.json({ 
      comparisonData,
      radarData,
      metrics: mockComparisonMetrics,
      aiInsights
    });
  } catch (error) {
    console.error("Failed to run comparison:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
