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
        status: "processing", // initial status
      },
    });

    // We would trigger the background RAG indexing microservice here

    return NextResponse.json({ document });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
