import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { mockMetrics } from "@/data/mockData";

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

    const { searchParams } = new URL(req.url);
    const company = searchParams.get("company");
    const year = searchParams.get("year");

    // In a real application, we would query the database here using Prisma.
    // For now, we return the mockMetrics as per the implementation plan.
    let metrics = mockMetrics;

    // We could filter by company and year if mockMetrics supported it,
    // but mockMetrics currently hardcodes DHT 2024.
    
    return NextResponse.json({ metrics });
  } catch (error) {
    console.error("Failed to fetch metrics:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
