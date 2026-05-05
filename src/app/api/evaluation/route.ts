import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function GET(req: Request) {
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

    // TODO: Connect to Prisma Database to retrieve actual evaluation runs
    const evalHistory = [
      { run: "Run 1", accuracy: 82, retrieval: 85, relevance: 80, latency: 2.8 },
      { run: "Run 2", accuracy: 84, retrieval: 88, relevance: 81, latency: 2.5 },
      { run: "Run 3", accuracy: 85, retrieval: 86, relevance: 85, latency: 2.4 },
      { run: "Run 4", accuracy: 87, retrieval: 92, relevance: 84, latency: 2.1 },
    ];

    return NextResponse.json({ evalHistory });
  } catch (error) {
    console.error("Failed to fetch evaluation history:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

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

    // Trigger an evaluation run on the RAG pipeline
    // TODO: Connect to RAG microservice to run actual evaluation
    
    const testCases = [
      {
        id: 1,
        question: "Doanh thu thuần của DHT năm 2024 là bao nhiêu?",
        expected: "2,847 tỷ đồng",
        actual: "Doanh thu thuần năm 2024 đạt 2,847 tỷ đồng, tăng 8.2%...",
        score: 0.95,
        sources: 3,
        status: "pass",
      },
      {
        id: 2,
        question: "ROE của DHT năm 2024?",
        expected: "8.7%",
        actual: "Tỷ suất lợi nhuận trên vốn chủ sở hữu (ROE) năm 2024 là 8.7%...",
        score: 0.88,
        sources: 2,
        status: "pass",
      },
      {
        id: 3,
        question: "Chi phí xây dựng cơ bản dở dang của dự án nhà máy là bao nhiêu?",
        expected: "790 tỷ đồng",
        actual: "Chi phí XDCB dở dang là 790 tỷ...",
        score: 0.72,
        sources: 1,
        status: "warn",
      },
      {
        id: 4,
        question: "Tại sao G&A tăng mạnh?",
        expected: "Do tăng chi phí khấu hao và chi phí nhân sự",
        actual: "Không tìm thấy thông tin cụ thể về nguyên nhân tăng chi phí G&A...",
        score: 0.3,
        sources: 0,
        status: "fail",
      },
    ];

    const currentScores = {
      accuracy: 87.3,
      retrieval: 92.1,
      relevance: 84.6,
      latency: 2.1
    };

    return NextResponse.json({ 
      success: true, 
      testCases,
      currentScores
    });
  } catch (error) {
    console.error("Failed to run evaluation:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
