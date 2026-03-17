import { getDB } from "@/lib/db/client";
import type { HSCodeCandidate } from "@/types/hs-code";

interface HSCodeEmbedding {
  code: string;
  description: string;
  embedding: number[];
}

let hsCodeEmbeddings: HSCodeEmbedding[] | null = null;

function cosineSimilarity(a: number[], b: number[]): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  if (denom === 0) return 0;
  return dotProduct / denom;
}

export function loadHSCodeEmbeddings(): void {
  if (hsCodeEmbeddings) return;

  const db = getDB();
  const rows = db
    .prepare(
      "SELECT code, description, embedding FROM hs_codes WHERE embedding IS NOT NULL"
    )
    .all() as { code: string; description: string; embedding: Buffer }[];

  hsCodeEmbeddings = rows.map((row) => ({
    code: row.code,
    description: row.description,
    embedding: Array.from(new Float32Array(row.embedding.buffer, row.embedding.byteOffset, row.embedding.byteLength / 4)),
  }));

  console.log(`Loaded ${hsCodeEmbeddings.length} HS code embeddings into memory`);
}

export function searchHSCodes(
  queryEmbedding: number[],
  topK: number = 20
): HSCodeCandidate[] {
  if (!hsCodeEmbeddings || hsCodeEmbeddings.length === 0) {
    // Fall back to loading all HS codes without embeddings for text-based matching
    return [];
  }

  const scored = hsCodeEmbeddings.map((hs) => ({
    code: hs.code,
    description: hs.description,
    similarity: cosineSimilarity(queryEmbedding, hs.embedding),
  }));

  scored.sort((a, b) => b.similarity - a.similarity);
  return scored.slice(0, topK);
}

export function getEmbeddingsLoaded(): boolean {
  return hsCodeEmbeddings !== null && hsCodeEmbeddings.length > 0;
}
