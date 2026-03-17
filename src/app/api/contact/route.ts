import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/db/client";

// In-memory rate limiter with periodic cleanup
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX = 5;
const CLEANUP_INTERVAL_MS = 10 * 60 * 1000; // 10 minutes
let lastCleanup = Date.now();

function cleanupExpiredEntries() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;
  for (const [ip, entry] of rateLimitMap) {
    if (now > entry.resetAt) {
      rateLimitMap.delete(ip);
    }
  }
}

function isRateLimited(ip: string): boolean {
  cleanupExpiredEntries();
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return true;
  }

  entry.count++;
  return false;
}

/** Truncate and trim user input. Parameterized queries handle SQL injection. */
function truncateInput(input: string): string {
  return input.trim().slice(0, 2000);
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { status: "error", message: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { name, email, phone, company, service, message } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { status: "error", message: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { status: "error", message: "Invalid email address." },
        { status: 400 }
      );
    }

    // Truncate all fields (parameterized queries prevent SQL injection)
    const sanitized = {
      name: truncateInput(name),
      email: truncateInput(email),
      phone: truncateInput(phone || ""),
      company: truncateInput(company || ""),
      service: truncateInput(service || ""),
      message: truncateInput(message),
    };

    // Store in database
    const db = getDB();

    // Auto-create table if needed
    db.exec(`
      CREATE TABLE IF NOT EXISTS contact_leads (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL DEFAULT '',
        company TEXT NOT NULL DEFAULT '',
        service TEXT NOT NULL DEFAULT '',
        message TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      )
    `);

    db.prepare(
      `INSERT INTO contact_leads (name, email, phone, company, service, message) VALUES (?, ?, ?, ?, ?, ?)`
    ).run(
      sanitized.name,
      sanitized.email,
      sanitized.phone,
      sanitized.company,
      sanitized.service,
      sanitized.message
    );

    console.log("[Contact Lead]", {
      name: sanitized.name,
      email: sanitized.email,
      service: sanitized.service,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({ status: "success" });
  } catch (error) {
    console.error("[Contact API Error]", error);
    return NextResponse.json(
      { status: "error", message: "Internal server error." },
      { status: 500 }
    );
  }
}
