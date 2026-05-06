import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyToken } from "@/lib/auth";

let ingestQueue = Promise.resolve();

function enqueueIngest(documentId: string, file: File) {
  const run = async () => {
    const fastApiFormData = new FormData();
    fastApiFormData.append("file", file);
    fastApiFormData.append("ocr_engine", "auto");
    fastApiFormData.append("language", "vie+eng");
    fastApiFormData.append("callback_url", `http://127.0.0.1:3000/api/documents/${documentId}/status`);

    try {
      const ragResponse = await fetch("http://127.0.0.1:8000/documents/ingest", {
        method: "POST",
        body: fastApiFormData,
      });

      if (!ragResponse.ok) {
        const details = await ragResponse.text();
        await prisma.document.update({
          where: { id: documentId },
          data: { status: "error", errorMessage: details || "RAG ingest failed" },
        });
        return;
      }

      const ragData = await ragResponse.json();
      await prisma.document.update({
        where: { id: documentId },
        data: {
          status: "indexed",
          chunks: ragData.chunks || 0,
          pages: ragData.pages || null,
          parsedPath: ragData.parsed_path || null,
          parsedPreview: ragData.parsed_preview || null,
          ragDocumentId: ragData.document_id || null,
          ocrEngine: ragData.ocr_engine || null,
          errorMessage: null,
        },
      });
    } catch (error) {
      await prisma.document.update({
        where: { id: documentId },
        data: { status: "error", errorMessage: error instanceof Error ? error.message : String(error) },
      });
    }
  };

  ingestQueue = ingestQueue.catch(() => undefined).then(run);
}

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

    const where: any = {};
    if (company) where.company = company;
    if (year) where.year = parseInt(year);

    const documents = await prisma.document.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ documents });
  } catch (error) {
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

    const formData = await req.formData();
    const files = formData.getAll("files").filter((value): value is File => value instanceof File);
    const fallbackFile = formData.get("file");
    if (fallbackFile instanceof File) files.push(fallbackFile);

    const company = formData.get("company") as string;
    const year = parseInt(formData.get("year") as string);
    const quarter = formData.get("quarter") as string;

    if (files.length === 0 || !company || !year) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const documents = [];

    for (const file of files) {
      const fileName = file.name;
      const fileType = fileName.split('.').pop() || "unknown";
      const fileSize = (file.size / (1024 * 1024)).toFixed(1) + " MB";
      const path = `/uploads/${Date.now()}-${fileName}`;

      const document = await prisma.document.create({
        data: {
          name: fileName,
          type: fileType,
          size: fileSize,
          path,
          company,
          year,
          quarter: quarter || null,
          status: "parsing",
        },
      });

      documents.push(document);

      enqueueIngest(document.id, file);
    }

    return NextResponse.json({
      documents,
      document: documents[0] || null,
    });
  } catch (error) {
    console.error("Documents upload error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    );
  }
}
