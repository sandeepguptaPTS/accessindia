/**
 * Run with: npx tsx scripts/generate-embeddings.ts
 *
 * Generates embeddings for all HS codes and stores them in SQLite.
 * Requires GEMINI_API_KEY in .env.local
 */

import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import Database from "better-sqlite3";
import path from "path";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { initializeDatabase } from "../src/lib/db/schema";
import { seedDatabase } from "../src/lib/db/seed";

const DB_PATH = path.join(process.cwd(), "accessindia.db");

async function main() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("Set GEMINI_API_KEY in .env.local");
    process.exit(1);
  }

  const db = new Database(DB_PATH);
  initializeDatabase(db);
  seedDatabase(db);
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-embedding-001" });

  // Get all HS codes without embeddings
  const rows = db
    .prepare("SELECT code, description FROM hs_codes WHERE embedding IS NULL")
    .all() as { code: string; description: string }[];

  if (rows.length === 0) {
    console.log("All HS codes already have embeddings.");
    return;
  }

  console.log(`Generating embeddings for ${rows.length} HS codes...`);

  // Process in batches of 20
  const batchSize = 20;
  const updateStmt = db.prepare(
    "UPDATE hs_codes SET embedding = ? WHERE code = ?"
  );

  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize);
    const texts = batch.map(
      (r) => `HS Code ${r.code}: ${r.description}`
    );

    try {
      const result = await model.batchEmbedContents({
        requests: texts.map((text) => ({
          content: { role: "user", parts: [{ text }] },
        })),
      });

      const transaction = db.transaction(() => {
        for (let j = 0; j < batch.length; j++) {
          const embedding = result.embeddings[j].values;
          const buffer = Buffer.from(new Float32Array(embedding).buffer);
          updateStmt.run(buffer, batch[j].code);
        }
      });
      transaction();

      console.log(
        `  Processed ${Math.min(i + batchSize, rows.length)}/${rows.length}`
      );
    } catch (error) {
      console.error(`Error processing batch at index ${i}:`, error);
      // Wait and retry
      await new Promise((resolve) => setTimeout(resolve, 2000));
      i -= batchSize; // retry this batch
    }

    // Rate limiting
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  console.log("Done! All embeddings generated and stored.");
  db.close();
}

main().catch(console.error);
