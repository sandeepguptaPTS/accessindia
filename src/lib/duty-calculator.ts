import type { DutyBreakdown } from "@/types/compliance-report";
import type { DBDutyRate } from "@/types/database";

/**
 * Deterministic duty calculation — NOT LLM.
 *
 * BCD = AV × bcd_rate%
 * AIDC = AV × aidc_rate%
 * SWS = BCD × sws_rate%
 * IGST_base = AV + BCD + AIDC + SWS
 * IGST = IGST_base × igst_rate%
 * Total = BCD + AIDC + SWS + IGST + compensation_cess
 */
export function calculateDuty(
  assessableValueUSD: number,
  dutyRate: DBDutyRate,
  usdToInr: number = 83.5
): DutyBreakdown {
  const av = assessableValueUSD * usdToInr;

  const bcdAmount = av * (dutyRate.bcd_rate / 100);
  const aidcAmount = av * (dutyRate.aidc_rate / 100);
  const swsAmount = bcdAmount * (dutyRate.sws_rate / 100);
  const igstBase = av + bcdAmount + aidcAmount + swsAmount;
  const igstAmount = igstBase * (dutyRate.igst_rate / 100);
  const compensationCess =
    igstBase * (dutyRate.compensation_cess_rate / 100);

  const totalDuty = bcdAmount + aidcAmount + swsAmount + igstAmount + compensationCess;
  const effectiveDutyRate = av > 0 ? (totalDuty / av) * 100 : 0;

  return {
    assessableValue: round2(av),
    currency: "INR",
    bcdRate: dutyRate.bcd_rate,
    bcdAmount: round2(bcdAmount),
    aidcRate: dutyRate.aidc_rate,
    aidcAmount: round2(aidcAmount),
    swsRate: dutyRate.sws_rate,
    swsAmount: round2(swsAmount),
    igstRate: dutyRate.igst_rate,
    igstAmount: round2(igstAmount),
    compensationCess: round2(compensationCess),
    totalDuty: round2(totalDuty),
    effectiveDutyRate: round2(effectiveDutyRate),
  };
}

/**
 * Calculate duty with preferential FTA BCD rate
 */
export function calculateDutyWithFTA(
  assessableValueUSD: number,
  dutyRate: DBDutyRate,
  preferentialBcdRate: number,
  usdToInr: number = 83.5
): DutyBreakdown {
  const modifiedRate: DBDutyRate = {
    ...dutyRate,
    bcd_rate: preferentialBcdRate,
  };
  return calculateDuty(assessableValueUSD, modifiedRate, usdToInr);
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
