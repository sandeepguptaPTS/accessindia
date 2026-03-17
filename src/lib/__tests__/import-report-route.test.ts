import { describe, it, expect, vi, beforeAll, afterAll } from "vitest";
import Database from "better-sqlite3";
import { initializeDatabase } from "@/lib/db/schema";

// Create an in-memory SQLite DB for testing
let testDB: Database.Database;

vi.mock("@/lib/db/client", () => ({
  getDB: () => testDB,
}));

vi.mock("@/lib/rag/vector-search", () => ({
  loadHSCodeEmbeddings: vi.fn(),
}));

vi.mock("@/lib/ai/classify-hs", () => ({
  classifyHSCode: vi.fn(),
}));

vi.mock("@/lib/ai/import-report", () => ({
  synthesizeComplianceReport: vi.fn().mockResolvedValue({
    riskSummary: "Test risk summary",
    regulatoryNotes: "Test regulatory notes",
  }),
}));

const { POST } = await import("@/app/api/import-report/route");
const { classifyHSCode } = await import("@/lib/ai/classify-hs");
const mockClassify = vi.mocked(classifyHSCode);

function makeRequest(body: Record<string, unknown>) {
  return new Request("http://localhost/api/import-report", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

beforeAll(() => {
  testDB = new Database(":memory:");
  initializeDatabase(testDB);

  // Seed minimal data for a known HS code
  testDB.prepare(
    "INSERT INTO hs_codes (code, description, chapter, heading, unit) VALUES (?, ?, ?, ?, ?)"
  ).run("0409.00", "Natural honey", "04", "0409", "KGS");

  testDB.prepare(
    "INSERT INTO duty_rates (hs_code, bcd_rate, aidc_rate, sws_rate, igst_rate, compensation_cess_rate, effective_from, notification_no) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
  ).run("0409.00", 60, 0, 10, 5, 0, "2024-02-01", "02/2024-Customs");

  testDB.prepare(
    "INSERT INTO dgft_licensing (hs_code, classification, scomet_listed, epr_required, moef_permission) VALUES (?, ?, ?, ?, ?)"
  ).run("0409.00", "free", 0, 0, 0);

  testDB.prepare(
    "INSERT INTO process_steps (step_code, name, description, is_mandatory, prerequisites, timeline, documents_required, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
  ).run("IEC", "IEC Registration", "Get IEC", 1, "[]", "3-5 days", "[]", 1);
});

afterAll(() => {
  testDB.close();
});

describe("POST /api/import-report — input validation", () => {
  it("rejects missing productDescription", async () => {
    const res = await POST(makeRequest({
      originCountry: "China",
      assessableValueUSD: 1000,
    }) as never);

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain("productDescription");
  });

  it("rejects short productDescription", async () => {
    const res = await POST(makeRequest({
      productDescription: "ab",
      originCountry: "China",
      assessableValueUSD: 1000,
    }) as never);

    expect(res.status).toBe(400);
  });

  it("rejects missing originCountry", async () => {
    const res = await POST(makeRequest({
      productDescription: "Natural honey",
      assessableValueUSD: 1000,
    }) as never);

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain("originCountry");
  });

  it("rejects zero assessableValueUSD", async () => {
    const res = await POST(makeRequest({
      productDescription: "Natural honey",
      originCountry: "China",
      assessableValueUSD: 0,
    }) as never);

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain("assessableValueUSD");
  });

  it("rejects negative assessableValueUSD", async () => {
    const res = await POST(makeRequest({
      productDescription: "Natural honey",
      originCountry: "China",
      assessableValueUSD: -100,
    }) as never);

    expect(res.status).toBe(400);
  });

  it("rejects non-finite assessableValueUSD", async () => {
    const res = await POST(makeRequest({
      productDescription: "Natural honey",
      originCountry: "China",
      assessableValueUSD: Infinity,
    }) as never);

    expect(res.status).toBe(400);
  });
});

describe("POST /api/import-report — classification flow", () => {
  it("returns needs_classification when confidence < 0.7", async () => {
    mockClassify.mockResolvedValue({
      hsCode: "0409.00",
      description: "Natural honey",
      confidence: 0.5,
      candidates: [{ code: "0409.00", description: "Natural honey", similarity: 0.5 }],
      needsUserSelection: true,
    });

    const res = await POST(makeRequest({
      productDescription: "honey stuff",
      originCountry: "China",
      assessableValueUSD: 1000,
    }) as never);

    const data = await res.json();
    expect(data.status).toBe("needs_classification");
    expect(data.classification.needsUserSelection).toBe(true);
  });

  it("returns complete report with valid HS code provided", async () => {
    const res = await POST(makeRequest({
      productDescription: "Natural honey",
      originCountry: "China",
      assessableValueUSD: 1000,
      hsCode: "0409.00",
    }) as never);

    const data = await res.json();
    expect(data.status).toBe("complete");
    expect(data.report).toBeTruthy();
    expect(data.report.hsCode).toBe("0409.00");
    expect(data.report.dutyBreakdown).toBeTruthy();
    expect(data.report.dutyBreakdown.assessableValue).toBe(83500);
    expect(data.report.dutyBreakdown.bcdRate).toBe(60);
    expect(data.report.id).toBeTruthy(); // UUID generated
    expect(data.report.generatedAt).toBeTruthy();
  });

  it("persists report to generated_reports table", async () => {
    const res = await POST(makeRequest({
      productDescription: "Natural honey",
      originCountry: "China",
      assessableValueUSD: 1000,
      hsCode: "0409.00",
    }) as never);

    const data = await res.json();
    const row = testDB.prepare("SELECT * FROM generated_reports WHERE id = ?").get(data.report.id) as Record<string, unknown>;
    expect(row).toBeTruthy();
    expect(row.tool).toBe("import-navigator");

    const storedReport = JSON.parse(row.report_content as string);
    expect(storedReport.hsCode).toBe("0409.00");
  });

  it("handles unknown HS code with null dutyBreakdown gracefully", async () => {
    const res = await POST(makeRequest({
      productDescription: "Unknown product",
      originCountry: "China",
      assessableValueUSD: 1000,
      hsCode: "9999.99",
    }) as never);

    const data = await res.json();
    expect(data.status).toBe("complete");
    expect(data.report.dutyBreakdown).toBeTruthy();
    // Should use the zero-valued fallback, not crash
    expect(data.report.dutyBreakdown.totalDuty).toBe(0);
    expect(data.report.dutyBreakdown.currency).toBe("INR");
  });

  it("returns complete report when classification confidence >= 0.7", async () => {
    mockClassify.mockResolvedValue({
      hsCode: "0409.00",
      description: "Natural honey",
      confidence: 0.95,
      candidates: [{ code: "0409.00", description: "Natural honey", similarity: 0.95 }],
      needsUserSelection: false,
    });

    const res = await POST(makeRequest({
      productDescription: "Natural honey",
      originCountry: "China",
      assessableValueUSD: 1000,
    }) as never);

    const data = await res.json();
    expect(data.status).toBe("complete");
    expect(data.report.hsCode).toBe("0409.00");
  });
});
