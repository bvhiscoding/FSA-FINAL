import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: any
) {
  try {
    const { docId } = await params;
    const document = await prisma.document.findUnique({
      where: { id: docId },
      select: {
        id: true,
        status: true,
      }
    });

    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    // Mock progress based on status, normally this would come from a queue or database
    let progress = 0;
    let currentStep = "";

    switch (document.status) {
      case "uploading":
        progress = 20;
        currentStep = "Uploading file...";
        break;
      case "processing":
        progress = 60;
        currentStep = "Extracting text and chunking...";
        break;
      case "indexing":
        progress = 80;
        currentStep = "Generating embeddings...";
        break;
      case "ready":
        progress = 100;
        currentStep = "Ready for querying";
        break;
      case "error":
        progress = 0;
        currentStep = "Error processing document";
        break;
      default:
        progress = 0;
        currentStep = "Unknown";
    }

    return NextResponse.json({ 
      status: document.status,
      progress,
      currentStep
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
