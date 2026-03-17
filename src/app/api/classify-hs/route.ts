import { NextRequest, NextResponse } from "next/server";
import { classifyHSCode } from "@/lib/ai/classify-hs";
import { loadHSCodeEmbeddings } from "@/lib/rag/vector-search";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productDescription, originCountry } = body;

    if (
      !productDescription ||
      typeof productDescription !== "string" ||
      productDescription.trim().length < 3
    ) {
      return NextResponse.json(
        { error: "productDescription must be at least 3 characters" },
        { status: 400 }
      );
    }

    // Try to load embeddings (will be no-op if already loaded or none exist)
    loadHSCodeEmbeddings();

    const result = await classifyHSCode(productDescription, originCountry);
    return NextResponse.json(result);
  } catch (error) {
    console.error("HS classification error:", error);
    return NextResponse.json(
      { error: "Failed to classify HS code" },
      { status: 500 }
    );
  }
}
