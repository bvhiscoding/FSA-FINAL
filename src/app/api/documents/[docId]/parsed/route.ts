import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { readFile } from "fs/promises";
import path from "path";

const ragRoot = path.resolve(process.cwd(), "RAG-system");

export async function GET(_req: Request, { params }: { params: Promise<{ docId: string }> }) {
  try {
    const { docId } = await params;
    const document = await prisma.document.findUnique({ where: { id: docId } });

    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    if (!document.parsedPath) {
      return NextResponse.json({ error: "Parsed OCR output not available" }, { status: 404 });
    }

    const absolutePath = path.resolve(document.parsedPath);
    if (!absolutePath.startsWith(ragRoot)) {
      return NextResponse.json({ error: "Invalid parsed path" }, { status: 400 });
    }

    const markdown = await readFile(absolutePath, "utf-8");
    return NextResponse.json({ markdown, document });
  } catch (error) {
    console.error("Parsed document read error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    );
  }
}
