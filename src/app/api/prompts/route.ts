import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyToken } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    const where: any = {};
    if (category) where.category = category;

    const prompts = await prisma.promptTemplate.findMany({
      where,
      orderBy: { usageCount: "desc" },
    });

    return NextResponse.json({ prompts });
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

    const body = await req.json();
    const { title, description, category, variables, template, outputFmt } = body;

    if (!title || !template) {
      return NextResponse.json({ error: "Missing title or template" }, { status: 400 });
    }

    const prompt = await prisma.promptTemplate.create({
      data: {
        title,
        description: description || "",
        category: category || "general",
        variables: JSON.stringify(variables || []),
        template,
        outputFmt: outputFmt || "text",
      },
    });

    return NextResponse.json({ prompt });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
