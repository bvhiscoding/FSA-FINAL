import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyToken } from "@/lib/auth";

function mapContextSource(c: any, index: number) {
  return {
    id: `${c.metadata?.document_id || "doc"}:${c.metadata?.page || 0}:${c.metadata?.chunk_index ?? index}`,
    contextNumber: index + 1,
    documentId: c.metadata?.document_id || c.document_id || "doc",
    documentName: c.metadata?.filename || c.filename || "Tài liệu BCTC",
    title: c.metadata?.filename || c.filename || "Tài liệu BCTC",
    page: c.metadata?.page || null,
    chunkIndex: c.metadata?.chunk_index ?? null,
    chunk: c.text || "",
    relevanceScore: typeof c.score === "number" ? c.score : 0,
    ocrEngine: c.metadata?.ocr_engine || null,
    type: c.metadata?.mimetype || "pdf",
  };
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

    const body = await req.json();
    const { message, chatId, company, docSet, ticker } = body;

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    let chat = chatId
      ? await prisma.chat.findUnique({ where: { id: chatId } })
      : null;

    if (chat && chat.userId !== decoded.userId) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    if (!chat) {
      chat = await prisma.chat.create({
        data: {
          title: message.slice(0, 80),
          company: company || "Unknown",
          docSet: docSet || "Default",
          userId: decoded.userId,
        },
      });
    }

    await prisma.chatMessage.create({
      data: {
        chatId: chat.id,
        role: "user",
        content: message,
      },
    });

    const FASTAPI_URL = "http://127.0.0.1:8000";
    const response = await fetch(`${FASTAPI_URL}/query`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question: message,
        top_k: 5,
        ticker: ticker || null,
        include_structured: true,
      }),
    });

    if (!response.ok) {
      const details = await response.text();
      return NextResponse.json(
        { error: "RAG Service error", details },
        { status: 502 },
      );
    }

    const data = await response.json();
    const sources = data.contexts ? data.contexts.map(mapContextSource) : [];
    const structuredContext = data.structured_context || null;
    const metrics: any[] = structuredContext
      ? [{ label: "Ticker", value: data.ticker || ticker || "Structured DB" }]
      : [];

    const assistantMessage = await prisma.chatMessage.create({
      data: {
        chatId: chat.id,
        role: "assistant",
        content: data.answer,
        sources: JSON.stringify(sources),
        metrics: JSON.stringify(metrics),
      },
    });

    const updatedChat = await prisma.chat.update({
      where: { id: chat.id },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json({
      chat: updatedChat,
      message: {
        id: assistantMessage.id,
        role: "assistant",
        content: assistantMessage.content,
        timestamp: assistantMessage.createdAt.toISOString(),
      },
      metrics,
      sources,
      structuredContext,
      ticker: data.ticker || ticker || null,
    });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    );
  }
}
