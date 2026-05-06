import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyToken } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: any
) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { docId } = await params;
    const document = await prisma.document.findUnique({
      where: { id: docId },
    });

    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    return NextResponse.json({ document });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: any
) {
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

    const { docId } = await params;
    const document = await prisma.document.findUnique({
      where: { id: docId },
    });

    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    let deletedRagChunks = 0;
    if (document.ragDocumentId) {
      const ragResponse = await fetch(`http://127.0.0.1:8000/documents/${document.ragDocumentId}`, {
        method: "DELETE",
      });
      if (!ragResponse.ok) {
        const details = await ragResponse.text();
        return NextResponse.json({ error: "RAG delete failed", details }, { status: 502 });
      }
      const ragData = await ragResponse.json();
      deletedRagChunks = ragData.deleted_chunks || 0;
    }

    await prisma.document.delete({
      where: { id: docId },
    });

    return NextResponse.json({ success: true, deletedRagChunks });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
