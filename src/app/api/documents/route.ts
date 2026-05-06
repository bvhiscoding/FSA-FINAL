import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
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

    // Since this might be a FormData for file upload, we handle it
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const company = formData.get("company") as string;
    const year = parseInt(formData.get("year") as string);
    const quarter = formData.get("quarter") as string;

    if (!file || !company || !year) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Basic file info processing
    const fileName = file.name;
    const fileType = fileName.split('.').pop() || "unknown";
    const fileSize = (file.size / (1024 * 1024)).toFixed(1) + " MB";
    
    // In a real scenario, you'd save the file to local disk or S3 here.
    // We'll just mock the path
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

    const fastApiFormData = new FormData();
    fastApiFormData.append("file", file);
    fastApiFormData.append("ocr_engine", "auto");
    fastApiFormData.append("language", "vie+eng");
    fastApiFormData.append("callback_url", `http://127.0.0.1:3000/api/documents/${document.id}/status`);

    const ragResponse = await fetch("http://127.0.0.1:8000/documents/ingest", {
      method: "POST",
      body: fastApiFormData,
    });

    if (!ragResponse.ok) {
      const details = await ragResponse.text();
      await prisma.document.update({
        where: { id: document.id },
        data: { status: "error", errorMessage: details || "RAG ingest failed" },
      });
      return NextResponse.json({ error: "RAG ingest failed", details }, { status: 502 });
    }

    const ragData = await ragResponse.json();
    const updatedDocument = await prisma.document.update({
      where: { id: document.id },
      data: {
        status: "indexed",
        chunks: ragData.chunks || 0,
        pages: ragData.pages || null,
        parsedPath: ragData.parsed_path || null,
        parsedPreview: ragData.parsed_preview || null,
        ocrEngine: ragData.ocr_engine || null,
        errorMessage: null,
      },
    });

    return NextResponse.json({ document: updatedDocument });
  } catch (error) {
    console.error("Documents upload error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    );
  }
}
