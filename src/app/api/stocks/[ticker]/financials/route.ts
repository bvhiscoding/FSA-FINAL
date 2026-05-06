import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function GET(req: Request, { params }: any) {
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

    const { ticker } = await params;
    const { searchParams } = new URL(req.url);
    const limit = searchParams.get("limit") || "8";
    const response = await fetch(`http://127.0.0.1:8000/stocks/${encodeURIComponent(ticker)}/financials?limit=${encodeURIComponent(limit)}`);
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return NextResponse.json(data || { error: "Stock financials failed" }, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
