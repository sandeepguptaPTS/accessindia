import {
  lookupDutyRates,
  lookupFTARates,
  lookupAntiDumpingDuties,
  lookupCertifications,
  lookupDGFTLicensing,
  lookupProcessSteps,
} from "./structured-lookup";
import { calculateDuty, calculateDutyWithFTA } from "@/lib/duty-calculator";
import type {
  DutyBreakdown,
  FTAOption,
  CertificationRequirement,
  AntiDumpingDuty,
  DGFTLicensing,
  ProcessStep,
  Citation,
} from "@/types/compliance-report";

export interface ComplianceContext {
  hsCode: string;
  hsDescription: string;
  dutyBreakdown: DutyBreakdown | null;
  ftaOptions: FTAOption[];
  certifications: CertificationRequirement[];
  antiDumpingDuties: AntiDumpingDuty[];
  dgftLicensing: DGFTLicensing | null;
  processSteps: ProcessStep[];
  citations: Citation[];
}

export function buildComplianceContext(
  hsCode: string,
  hsDescription: string,
  originCountry: string,
  assessableValueUSD: number
): ComplianceContext {
  const citations: Citation[] = [];

  // 1. Duty rates
  const dutyRateRow = lookupDutyRates(hsCode);
  let dutyBreakdown: DutyBreakdown | null = null;
  if (dutyRateRow) {
    dutyBreakdown = calculateDuty(assessableValueUSD, dutyRateRow);
    citations.push({
      source: "CBIC Customs Tariff",
      reference: `Notification No. ${dutyRateRow.notification_no}`,
      date: dutyRateRow.effective_from,
    });
  }

  // 2. FTA rates with savings calculation
  const ftaOptions = lookupFTARates(hsCode, originCountry);
  if (dutyRateRow && dutyBreakdown) {
    for (const fta of ftaOptions) {
      const ftaDuty = calculateDutyWithFTA(
        assessableValueUSD,
        dutyRateRow,
        fta.preferentialBcdRate
      );
      fta.potentialSaving = Math.round(
        (dutyBreakdown.totalDuty - ftaDuty.totalDuty) * 100
      ) / 100;
    }
  }
  if (ftaOptions.length > 0) {
    citations.push({
      source: "CBIC FTA Notifications",
      reference: "Preferential rate schedules under respective trade agreements",
      date: "2024-01-01",
    });
  }

  // 3. Anti-dumping duties
  const antiDumpingDuties = lookupAntiDumpingDuties(hsCode, originCountry);
  if (antiDumpingDuties.length > 0) {
    citations.push({
      source: "DGTR Anti-Dumping Notifications",
      reference: antiDumpingDuties
        .map((d) => d.notificationNo)
        .filter(Boolean)
        .join(", "),
      date: "2024-01-01",
    });
  }

  // 4. Certifications
  const certifications = lookupCertifications(hsCode);
  for (const cert of certifications) {
    citations.push({
      source: `${cert.body} Regulations`,
      reference: `${cert.name}`,
      date: "2024-01-01",
    });
  }

  // 5. DGFT licensing
  const dgftLicensing = lookupDGFTLicensing(hsCode);
  if (dgftLicensing) {
    citations.push({
      source: "DGFT ITC(HS) Classification",
      reference: `Import policy for HS ${hsCode}`,
      date: "2024-01-01",
    });
  }

  // 6. Process steps
  const processSteps = lookupProcessSteps();

  return {
    hsCode,
    hsDescription,
    dutyBreakdown,
    ftaOptions,
    certifications,
    antiDumpingDuties,
    dgftLicensing,
    processSteps,
    citations,
  };
}
