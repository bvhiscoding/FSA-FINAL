import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

const OLLAMA_URL = "https://inspirative-separately-earlean.ngrok-free.dev";

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

    // TODO: Implement RAG retrieval here
    // For now, just send to Ollama directly
    
    const ollamaPayload = {
      model: model || "llama3",
      messages: [
        { role: "system", content: "You are a professional financial analyst. Provide clear, data-driven insights based on financial statements." },
        ...(history || []),
        { role: "user", content: message }
      ],
      stream: false,
    };

    const response = await fetch(`${OLLAMA_URL}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ollamaPayload),
    });

    if (!response.ok) {
      throw new Error(`Ollama error: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Save message to DB (optional, but good for persistence)
    // if (chatId) {
    //   await prisma.chatMessage.createMany({
    //     data: [
    //       { chatId, role: "user", content: message },
    //       { chatId, role: "assistant", content: data.message.content }
    //     ]
    //   });
    // }

    return NextResponse.json({
      message: {
        role: "assistant",
        content: data.message.content,
        timestamp: new Date().toISOString(),
      },
      metrics: [], // Mock metrics for now
      sources: []  // Mock sources for now
    });

  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
