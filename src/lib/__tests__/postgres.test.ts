import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock @vercel/postgres before importing the module
const mockSql = vi.fn().mockResolvedValue({ rows: [] });

vi.mock("@vercel/postgres", () => ({
  sql: new Proxy(mockSql, {
    // Tagged template literal support: sql`...` calls the function with template parts
    apply(target, _thisArg, args) {
      return target(args);
    },
  }),
}));

describe("postgres module", () => {
  beforeEach(() => {
    vi.resetModules();
    mockSql.mockClear();
  });

  it("usePostgres is false when POSTGRES_URL is not set", async () => {
    delete process.env.POSTGRES_URL;
    const { usePostgres } = await import("@/lib/db/postgres");
    expect(usePostgres).toBe(false);
  });

  it("usePostgres is true when POSTGRES_URL is set", async () => {
    process.env.POSTGRES_URL = "postgres://test:test@localhost/test";
    const { usePostgres } = await import("@/lib/db/postgres");
    expect(usePostgres).toBe(true);
    delete process.env.POSTGRES_URL;
  });

  it("getReport returns null when no rows found", async () => {
    mockSql.mockResolvedValueOnce({ rows: [] });
    const { getReport } = await import("@/lib/db/postgres");
    const result = await getReport("non-existent-id");
    expect(result).toBeNull();
  });

  it("getReport converts Date created_at to ISO string", async () => {
    const testDate = new Date("2026-03-17T10:00:00Z");
    // First two calls are for ensurePostgresTables (CREATE TABLE)
    mockSql.mockResolvedValueOnce({ rows: [] }); // CREATE generated_reports
    mockSql.mockResolvedValueOnce({ rows: [] }); // CREATE contact_leads
    mockSql.mockResolvedValueOnce({
      rows: [{
        id: "test-id",
        tool: "import-navigator",
        input_data: "{}",
        report_content: '{"test":true}',
        created_at: testDate,
      }],
    });

    const { getReport } = await import("@/lib/db/postgres");
    const result = await getReport("test-id");
    expect(result).not.toBeNull();
    expect(result!.id).toBe("test-id");
    expect(result!.created_at).toBe("2026-03-17T10:00:00.000Z");
  });
});
