import { getDB } from "@/lib/db/client";
import { getEmbedding } from "./embeddings";
import { generateJSON } from "./gemini";
import {
  searchHSCodes,
  getEmbeddingsLoaded,
} from "@/lib/rag/vector-search";
import type { ClassificationResult, HSCodeCandidate } from "@/types/hs-code";

interface GeminiClassificationResponse {
  selectedCode: string;
  confidence: number;
  reasoning: string;
}

export async function classifyHSCode(
  productDescription: string,
  originCountry?: string
): Promise<ClassificationResult> {
  let candidates: HSCodeCandidate[];

  if (getEmbeddingsLoaded()) {
    // Stage 1: Vector similarity search
    const queryEmbedding = await getEmbedding(productDescription);
    candidates = searchHSCodes(queryEmbedding, 20);
  } else {
    // Fallback: Text-based search via SQL LIKE
    const db = getDB();
    const rows = db
      .prepare(
        "SELECT code, description FROM hs_codes WHERE description LIKE ? LIMIT 20"
      )
      .all(`%${productDescription.split(" ")[0]}%`) as {
      code: string;
      description: string;
    }[];
    candidates = rows.map((r) => ({
      code: r.code,
      description: r.description,
      similarity: 0.5,
    }));

    // If no text match, return all codes for Gemini to pick
    if (candidates.length === 0) {
      const allRows = db
        .prepare("SELECT code, description FROM hs_codes")
        .all() as { code: string; description: string }[];
      candidates = allRows.map((r) => ({
        code: r.code,
        description: r.description,
        similarity: 0.5,
      }));
    }
  }

  if (candidates.length === 0) {
    return {
      hsCode: "",
      description: "",
      confidence: 0,
      candidates: [],
      needsUserSelection: true,
    };
  }

  // Stage 2: Gemini picks the best match
  const candidateList = candidates
    .map((c) => `${c.code}: ${c.description}`)
    .join("\n");

  // Sanitize user input to prevent prompt injection
  const sanitizedDescription = productDescription.replace(/["""]/g, "'").replace(/\n/g, " ").trim();
  const sanitizedCountry = originCountry?.replace(/["""]/g, "'").replace(/\n/g, " ").trim();

  const prompt = `You are an Indian customs classification expert. Given a product description, select the most appropriate HS code from the candidates below.

Product: "${sanitizedDescription}"
${sanitizedCountry ? `Origin country: ${sanitizedCountry}` : ""}

Candidate HS codes:
${candidateList}

Respond with JSON: { "selectedCode": "the HS code", "confidence": 0.0-1.0, "reasoning": "brief explanation" }

Rules:
- Pick the most specific matching code
- Confidence should reflect how certain the match is (0.9+ = very confident, 0.7-0.9 = likely, below 0.7 = uncertain)
- If none match well, pick the closest and set confidence low`;

  const result = await generateJSON<GeminiClassificationResponse>(prompt);

  const matchedCandidate = candidates.find(
    (c) => c.code === result.selectedCode
  );

  return {
    hsCode: result.selectedCode,
    description: matchedCandidate?.description || "",
    confidence: result.confidence,
    candidates: candidates.slice(0, 5),
    needsUserSelection: result.confidence < 0.7,
  };
}
