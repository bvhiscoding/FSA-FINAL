import { NextResponse } from "next/server";

const OLLAMA_URL = "https://inspirative-separately-earlean.ngrok-free.dev";

export async function GET() {
  try {
    const response = await fetch(`${OLLAMA_URL}/api/tags`);
    if (!response.ok) {
      throw new Error("Failed to fetch models from Ollama");
    }
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Ollama fetch error:", error);
    return NextResponse.json({ error: "Could not fetch models" }, { status: 500 });
  }
}
