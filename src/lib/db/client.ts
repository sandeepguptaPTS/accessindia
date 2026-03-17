import Database from "better-sqlite3";
import path from "path";
import { initializeDatabase } from "./schema";
import { seedDatabase } from "./seed";

let db: Database.Database | null = null;

export function getDB(): Database.Database {
  if (!db) {
    const dbPath = process.env.VERCEL
      ? path.join("/tmp", "accessindia.db")
      : path.join(process.cwd(), "accessindia.db");
    db = new Database(dbPath);
    initializeDatabase(db);
    seedDatabase(db);
  }
  return db;
}
