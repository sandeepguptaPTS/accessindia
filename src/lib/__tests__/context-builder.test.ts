import { describe, it, expect, vi, beforeAll, afterAll } from "vitest";
import Database from "better-sqlite3";
import { initializeDatabase } from "@/lib/db/schema";

// Create an in-memory SQLite DB for testing
let testDB: Database.Database;

vi.mock("@/lib/db/client", () => ({
  getDB: () => testDB,
}));

import { buildComplianceContext } from "@/lib/rag/context-builder";

beforeAll(() => {
  testDB = new Database(":memory:");
  initializeDatabase(testDB);

  // Seed test data
  testDB.prepare(
    "INSERT INTO hs_codes (code, description, chapter, heading, unit) VALUES (?, ?, ?, ?, ?)"
  ).run("0409.00", "Natural honey", "04", "0409", "KGS");

  testDB.prepare(
    "INSERT INTO duty_rates (hs_code, bcd_rate, aidc_rate, sws_rate, igst_rate, compensation_cess_rate, effective_from, notification_no) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
  ).run("0409.00", 60, 0, 10, 5, 0, "2024-02-01", "02/2024-Customs");

  testDB.prepare(
    "INSERT INTO fta_rates (hs_code, agreement_code, agreement_name, preferential_bcd_rate, rules_of_origin) VALUES (?, ?, ?, ?, ?)"
  ).run("0409.00", "ECTA-AUS", "India-Australia ECTA", 40, "Certificate of Origin required");

  testDB.prepare(
    "INSERT INTO anti_dumping_duties (hs_code, origin_country, duty_type, duty_amount, notification_no) VALUES (?, ?, ?, ?, ?)"
  ).run("0409.00", "China", "fixed", 500, "ADD/2024-01");

  testDB.prepare(
    "INSERT INTO certifications (body, name, applicable_hs_codes, is_mandatory, pre_shipment_required, risk_if_missing, process_summary) VALUES (?, ?, ?, ?, ?, ?, ?)"
  ).run("FSSAI", "Food License", '["0409.00"]', 1, 0, "Seizure at port", "Register with FSSAI");

  testDB.prepare(
    "INSERT INTO dgft_licensing (hs_code, classification, scomet_listed, epr_required, moef_permission) VALUES (?, ?, ?, ?, ?)"
  ).run("0409.00", "free", 0, 0, 0);

  testDB.prepare(
    "INSERT INTO process_steps (step_code, name, description, is_mandatory, prerequisites, timeline, documents_required, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
  ).run("IEC", "IEC Registration", "Register for Importer Exporter Code", 1, "[]", "3-5 days", '["PAN Card", "Aadhaar"]', 1);
});

afterAll(() => {
  testDB.close();
});

describe("buildComplianceContext", () => {
  it("builds full context for a known HS code", () => {
    const ctx = buildComplianceContext("0409.00", "Natural honey", "Australia", 1000);

    expect(ctx.hsCode).toBe("0409.00");
    expect(ctx.hsDescription).toBe("Natural honey");
  });

  it("calculates duty breakdown correctly", () => {
    const ctx = buildComplianceContext("0409.00", "Natural honey", "Australia", 1000);

    expect(ctx.dutyBreakdown).not.toBeNull();
    expect(ctx.dutyBreakdown!.assessableValue).toBe(83500); // 1000 * 83.5
    expect(ctx.dutyBreakdown!.bcdRate).toBe(60);
    expect(ctx.dutyBreakdown!.bcdAmount).toBe(50100);
    expect(ctx.dutyBreakdown!.currency).toBe("INR");
  });

  it("finds applicable FTA for Australia", () => {
    const ctx = buildComplianceContext("0409.00", "Natural honey", "Australia", 1000);

    expect(ctx.ftaOptions).toHaveLength(1);
    expect(ctx.ftaOptions[0].agreementCode).toBe("ECTA-AUS");
    expect(ctx.ftaOptions[0].preferentialBcdRate).toBe(40);
    expect(ctx.ftaOptions[0].potentialSaving).toBeGreaterThan(0);
  });

  it("returns no FTA for non-FTA country", () => {
    const ctx = buildComplianceContext("0409.00", "Natural honey", "China", 1000);

    expect(ctx.ftaOptions).toHaveLength(0);
  });

  it("finds anti-dumping duties for China", () => {
    const ctx = buildComplianceContext("0409.00", "Natural honey", "China", 1000);

    expect(ctx.antiDumpingDuties).toHaveLength(1);
    expect(ctx.antiDumpingDuties[0].originCountry).toBe("China");
    expect(ctx.antiDumpingDuties[0].dutyAmount).toBe(500);
  });

  it("returns no anti-dumping for non-affected country", () => {
    const ctx = buildComplianceContext("0409.00", "Natural honey", "Australia", 1000);

    expect(ctx.antiDumpingDuties).toHaveLength(0);
  });

  it("finds certifications for HS code", () => {
    const ctx = buildComplianceContext("0409.00", "Natural honey", "Australia", 1000);

    expect(ctx.certifications).toHaveLength(1);
    expect(ctx.certifications[0].body).toBe("FSSAI");
    expect(ctx.certifications[0].isMandatory).toBe(true);
  });

  it("finds DGFT licensing info", () => {
    const ctx = buildComplianceContext("0409.00", "Natural honey", "Australia", 1000);

    expect(ctx.dgftLicensing).not.toBeNull();
    expect(ctx.dgftLicensing!.classification).toBe("free");
    expect(ctx.dgftLicensing!.scometListed).toBe(false);
  });

  it("loads process steps", () => {
    const ctx = buildComplianceContext("0409.00", "Natural honey", "Australia", 1000);

    expect(ctx.processSteps.length).toBeGreaterThanOrEqual(1);
    expect(ctx.processSteps[0].stepCode).toBe("IEC");
    expect(ctx.processSteps[0].isMandatory).toBe(true);
    expect(ctx.processSteps[0].documentsRequired).toContain("PAN Card");
  });

  it("generates citations for each data source found", () => {
    const ctx = buildComplianceContext("0409.00", "Natural honey", "Australia", 1000);

    // Should have: duty rates, FTA, FSSAI cert, DGFT
    expect(ctx.citations.length).toBeGreaterThanOrEqual(3);
    const sources = ctx.citations.map((c) => c.source);
    expect(sources).toContain("CBIC Customs Tariff");
    expect(sources).toContain("CBIC FTA Notifications");
    expect(sources).toContain("FSSAI Regulations");
  });

  it("returns null dutyBreakdown for unknown HS code", () => {
    const ctx = buildComplianceContext("9999.99", "Unknown product", "China", 1000);

    expect(ctx.dutyBreakdown).toBeNull();
    expect(ctx.ftaOptions).toHaveLength(0);
    expect(ctx.certifications).toHaveLength(0);
    expect(ctx.dgftLicensing).toBeNull();
  });

  it("calculates FTA savings correctly", () => {
    const ctx = buildComplianceContext("0409.00", "Natural honey", "Australia", 1000);

    // Standard BCD: 60% on 83,500 = 50,100
    // FTA BCD: 40% on 83,500 = 33,400
    // Savings must be positive (includes cascading SWS + IGST savings)
    expect(ctx.ftaOptions[0].potentialSaving).toBeGreaterThan(0);

    // Standard total vs FTA total — saving should be more than just BCD difference
    // because SWS and IGST cascade from lower BCD
    const bcdDifference = 50100 - 33400; // 16,700
    expect(ctx.ftaOptions[0].potentialSaving).toBeGreaterThan(bcdDifference);
  });
});
