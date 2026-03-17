import { describe, it, expect, vi, beforeAll, afterAll, beforeEach } from "vitest";
import Database from "better-sqlite3";

// Create an in-memory SQLite DB for testing
let testDB: Database.Database;

vi.mock("@/lib/db/client", () => ({
  getDB: () => testDB,
}));

// Must import after mocking
const { POST } = await import("@/app/api/contact/route");

function makeRequest(body: Record<string, unknown>, ip?: string) {
  const headers = new Headers({ "Content-Type": "application/json" });
  if (ip) headers.set("x-forwarded-for", ip);
  return new Request("http://localhost/api/contact", {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
}

beforeAll(() => {
  testDB = new Database(":memory:");
});

afterAll(() => {
  testDB.close();
});

describe("POST /api/contact", () => {
  it("stores valid contact lead and returns success", async () => {
    const res = await POST(makeRequest({
      name: "Test User",
      email: "test@example.com",
      message: "I need help importing goods",
    }, "192.168.1.1") as never);

    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.status).toBe("success");

    // Verify it was stored in the DB
    const row = testDB.prepare("SELECT * FROM contact_leads WHERE email = ?").get("test@example.com") as Record<string, unknown>;
    expect(row).toBeTruthy();
    expect(row.name).toBe("Test User");
    expect(row.message).toBe("I need help importing goods");
  });

  it("stores optional fields (phone, company, service)", async () => {
    const res = await POST(makeRequest({
      name: "Full User",
      email: "full@example.com",
      phone: "+91-9876543210",
      company: "Acme Corp",
      service: "import-compliance",
      message: "Need regulatory guidance",
    }, "192.168.1.2") as never);

    const data = await res.json();
    expect(data.status).toBe("success");

    const row = testDB.prepare("SELECT * FROM contact_leads WHERE email = ?").get("full@example.com") as Record<string, unknown>;
    expect(row.company).toBe("Acme Corp");
    expect(row.service).toBe("import-compliance");
  });

  it("rejects missing name", async () => {
    const res = await POST(makeRequest({
      email: "test@example.com",
      message: "Hello",
    }, "192.168.1.3") as never);

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.message).toContain("required");
  });

  it("rejects missing email", async () => {
    const res = await POST(makeRequest({
      name: "Test",
      message: "Hello",
    }, "192.168.1.4") as never);

    expect(res.status).toBe(400);
  });

  it("rejects missing message", async () => {
    const res = await POST(makeRequest({
      name: "Test",
      email: "test@example.com",
    }, "192.168.1.5") as never);

    expect(res.status).toBe(400);
  });

  it("rejects invalid email format", async () => {
    const res = await POST(makeRequest({
      name: "Test",
      email: "not-an-email",
      message: "Hello",
    }, "192.168.1.6") as never);

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.message).toContain("email");
  });

  it("truncates long input to 2000 characters", async () => {
    const longMessage = "x".repeat(3000);
    const res = await POST(makeRequest({
      name: "Test",
      email: "truncate@example.com",
      message: longMessage,
    }, "192.168.1.7") as never);

    expect(res.status).toBe(200);

    const row = testDB.prepare("SELECT * FROM contact_leads WHERE email = ?").get("truncate@example.com") as Record<string, unknown>;
    expect((row.message as string).length).toBe(2000);
  });

  it("rate limits after 5 requests from same IP", async () => {
    const ip = "10.0.0.99";
    const body = { name: "Rate", email: "rate@example.com", message: "Test" };

    // First 5 should succeed
    for (let i = 0; i < 5; i++) {
      const res = await POST(makeRequest(body, ip) as never);
      expect(res.status).toBe(200);
    }

    // 6th should be rate-limited
    const res = await POST(makeRequest(body, ip) as never);
    expect(res.status).toBe(429);
    const data = await res.json();
    expect(data.message).toContain("Too many");
  });
});
