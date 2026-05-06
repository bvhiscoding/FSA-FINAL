import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const allowedStatuses = new Set([
  "parsing",
  "ocr",
  "chunking",
  "embedding",
  "indexed",
  "error",
]);

export async function GET(_req: Request, { params }: { params: Promise<{ docId: string }> }) {
  try {
    const { docId } = await params;
    const document = await prisma.document.findUnique({ where: { id: docId } });

    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    return NextResponse.json({ document });
  } catch (error) {
    console.error("Document status read error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    );
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ docId: string }> }) {
  try {
    const { docId } = await params;
    const body = await req.json();
    const status = String(body.status || "");

    if (!allowedStatuses.has(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const document = await prisma.document.update({
      where: { id: docId },
      data: {
        status,
        pages: typeof body.pages === "number" ? body.pages : undefined,
        chunks: typeof body.chunks === "number" ? body.chunks : undefined,
        parsedPath: typeof body.parsedPath === "string" ? body.parsedPath : undefined,
        parsedPreview: typeof body.parsedPreview === "string" ? body.parsedPreview : undefined,
        ocrEngine: typeof body.ocrEngine === "string" ? body.ocrEngine : undefined,
        errorMessage: typeof body.errorMessage === "string" ? body.errorMessage : undefined,
      },
    });

    return NextResponse.json({ document });
  } catch (error) {
    console.error("Document status callback error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    );
  }
}
