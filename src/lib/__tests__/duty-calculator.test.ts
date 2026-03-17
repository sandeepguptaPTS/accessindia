import { describe, it, expect } from "vitest";
import { calculateDuty, calculateDutyWithFTA } from "../duty-calculator";
import type { DBDutyRate } from "@/types/database";

// Helper to create a duty rate with defaults
function makeDutyRate(overrides: Partial<DBDutyRate> = {}): DBDutyRate {
  return {
    hs_code: "0409.00",
    bcd_rate: 60,
    aidc_rate: 0,
    sws_rate: 10,
    igst_rate: 5,
    compensation_cess_rate: 0,
    effective_from: "2024-02-01",
    notification_no: "02/2024-Customs",
    ...overrides,
  };
}

describe("calculateDuty", () => {
  it("calculates standard BCD + SWS + IGST correctly", () => {
    // Natural honey: BCD 60%, AIDC 0%, SWS 10% on BCD, IGST 5%
    const rate = makeDutyRate({
      bcd_rate: 60,
      aidc_rate: 0,
      sws_rate: 10,
      igst_rate: 5,
    });
    const result = calculateDuty(1000, rate, 83.5);

    // AV = 1000 * 83.5 = 83,500
    expect(result.assessableValue).toBe(83500);
    // BCD = 83,500 * 0.60 = 50,100
    expect(result.bcdAmount).toBe(50100);
    // AIDC = 0
    expect(result.aidcAmount).toBe(0);
    // SWS = 50,100 * 0.10 = 5,010 (on BCD, not AV)
    expect(result.swsAmount).toBe(5010);
    // IGST base = 83,500 + 50,100 + 0 + 5,010 = 138,610
    // IGST = 138,610 * 0.05 = 6,930.50
    expect(result.igstAmount).toBe(6930.5);
    // Total = 50,100 + 0 + 5,010 + 6,930.50 + 0 = 62,040.50
    expect(result.totalDuty).toBe(62040.5);
    expect(result.currency).toBe("INR");
  });

  it("handles zero BCD rate (electronics/medical)", () => {
    // Laptops (8471.30): BCD 0%, IGST 18%
    const rate = makeDutyRate({
      hs_code: "8471.30",
      bcd_rate: 0,
      aidc_rate: 0,
      sws_rate: 10,
      igst_rate: 18,
    });
    const result = calculateDuty(1000, rate, 83.5);

    expect(result.bcdAmount).toBe(0);
    // SWS on BCD (0) = 0
    expect(result.swsAmount).toBe(0);
    // IGST base = 83,500 + 0 + 0 + 0 = 83,500
    // IGST = 83,500 * 0.18 = 15,030
    expect(result.igstAmount).toBe(15030);
    expect(result.totalDuty).toBe(15030);
  });

  it("includes compensation cess for vehicles", () => {
    // Cars (8703.23): BCD 60%, IGST 28%, cess 17%
    const rate = makeDutyRate({
      hs_code: "8703.23",
      bcd_rate: 60,
      aidc_rate: 0,
      sws_rate: 10,
      igst_rate: 28,
      compensation_cess_rate: 17,
    });
    const result = calculateDuty(10000, rate, 83.5);

    const av = 835000;
    expect(result.assessableValue).toBe(av);
    const bcd = av * 0.6; // 501,000
    expect(result.bcdAmount).toBe(501000);
    const sws = bcd * 0.1; // 50,100
    expect(result.swsAmount).toBe(50100);
    const igstBase = av + bcd + 0 + sws; // 1,386,100
    const igst = igstBase * 0.28; // 388,108
    expect(result.igstAmount).toBe(388108);
    const cess = igstBase * 0.17; // 235,637
    expect(result.compensationCess).toBe(235637);
    expect(result.totalDuty).toBe(bcd + 0 + sws + igst + cess);
  });

  it("verifies SWS applies to BCD amount, not assessable value", () => {
    const rate = makeDutyRate({ bcd_rate: 30, sws_rate: 10 });
    const result = calculateDuty(1000, rate, 83.5);

    // BCD = 83,500 * 0.30 = 25,050
    expect(result.bcdAmount).toBe(25050);
    // SWS = 25,050 * 0.10 = 2,505 (on BCD, NOT on AV of 83,500)
    expect(result.swsAmount).toBe(2505);
    // If SWS were on AV, it would be 8,350 — verify it's NOT that
    expect(result.swsAmount).not.toBe(83500 * 0.1);
  });

  it("verifies IGST base = AV + BCD + AIDC + SWS", () => {
    const rate = makeDutyRate({
      bcd_rate: 20,
      aidc_rate: 5,
      sws_rate: 10,
      igst_rate: 18,
    });
    const result = calculateDuty(1000, rate, 83.5);

    const av = 83500;
    const bcd = av * 0.2; // 16,700
    const aidc = av * 0.05; // 4,175
    const sws = bcd * 0.1; // 1,670
    const igstBase = av + bcd + aidc + sws; // 106,045
    const igst = igstBase * 0.18; // 19,088.10

    expect(result.bcdAmount).toBe(16700);
    expect(result.aidcAmount).toBe(4175);
    expect(result.swsAmount).toBe(1670);
    expect(result.igstAmount).toBe(19088.1);
  });

  it("calculates effective duty rate correctly", () => {
    const rate = makeDutyRate({ bcd_rate: 10, igst_rate: 18 });
    const result = calculateDuty(1000, rate, 83.5);

    expect(result.effectiveDutyRate).toBe(
      Math.round((result.totalDuty / result.assessableValue) * 100 * 100) / 100
    );
  });

  it("handles zero assessable value without NaN", () => {
    const rate = makeDutyRate();
    const result = calculateDuty(0, rate, 83.5);

    expect(result.assessableValue).toBe(0);
    expect(result.totalDuty).toBe(0);
    expect(result.effectiveDutyRate).toBe(0);
    expect(Number.isNaN(result.effectiveDutyRate)).toBe(false);
  });
});

describe("calculateDutyWithFTA", () => {
  it("substitutes FTA preferential BCD rate", () => {
    // Standard BCD 60% → FTA BCD 40%
    const rate = makeDutyRate({ bcd_rate: 60, igst_rate: 5 });
    const standard = calculateDuty(1000, rate, 83.5);
    const fta = calculateDutyWithFTA(1000, rate, 40, 83.5);

    // FTA should use lower BCD rate
    expect(fta.bcdRate).toBe(40);
    expect(fta.bcdAmount).toBeLessThan(standard.bcdAmount);
    // SWS recalculates on lower BCD
    expect(fta.swsAmount).toBeLessThan(standard.swsAmount);
    // Total duty must be lower
    expect(fta.totalDuty).toBeLessThan(standard.totalDuty);

    // Verify exact values
    const av = 83500;
    expect(fta.bcdAmount).toBe(av * 0.4); // 33,400
    expect(fta.swsAmount).toBe(av * 0.4 * 0.1); // 3,340
  });

  it("FTA only changes BCD, other rates remain", () => {
    const rate = makeDutyRate({
      bcd_rate: 60,
      aidc_rate: 5,
      sws_rate: 10,
      igst_rate: 18,
    });
    const fta = calculateDutyWithFTA(1000, rate, 20, 83.5);

    // AIDC should use original rate, not FTA
    expect(fta.aidcRate).toBe(5);
    expect(fta.aidcAmount).toBe(83500 * 0.05);
    // IGST should use original rate
    expect(fta.igstRate).toBe(18);
  });
});
