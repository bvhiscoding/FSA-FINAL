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
    const { message, model, chatId, history } = body;

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const FASTAPI_URL = "http://127.0.0.1:8000";
    
    // Call Python RAG Microservice
    const ragPayload = {
      question: message,
      top_k: 5
    };

    const response = await fetch(`${FASTAPI_URL}/query`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ragPayload),
    });

    if (!response.ok) {
      throw new Error(`RAG Service error: ${response.statusText}`);
    }

    const data = await response.json();

    // Map RAG service response to Frontend ChatMessage format
    return NextResponse.json({
      message: {
        role: "assistant",
        content: data.answer,
        timestamp: new Date().toISOString(),
      },
      metrics: [], // Can extract metrics from LLM response later
      sources: data.contexts ? data.contexts.map((c: any) => ({
        id: c.metadata?.document_id || c.document_id || "doc",
        title: c.metadata?.filename || c.filename || "Tài liệu BCTC",
        type: "pdf"
      })) : []
    });

  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
