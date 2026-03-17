export interface DutyBreakdown {
  assessableValue: number;
  currency: string;
  bcdRate: number;
  bcdAmount: number;
  aidcRate: number;
  aidcAmount: number;
  swsRate: number;
  swsAmount: number;
  igstRate: number;
  igstAmount: number;
  compensationCess: number;
  totalDuty: number;
  effectiveDutyRate: number;
}

export interface FTAOption {
  agreementCode: string;
  agreementName: string;
  preferentialBcdRate: number;
  rulesOfOrigin: string;
  potentialSaving: number;
}

export interface CertificationRequirement {
  body: string;
  name: string;
  isMandatory: boolean;
  preShipmentRequired: boolean;
  riskIfMissing: string;
  processSummary: string;
}

export interface AntiDumpingDuty {
  originCountry: string;
  dutyType: string;
  dutyAmount: number;
  notificationNo: string;
}

export interface DGFTLicensing {
  classification: "free" | "restricted" | "prohibited";
  scometListed: boolean;
  eprRequired: boolean;
  moefPermission: boolean;
}

export interface ProcessStep {
  stepCode: string;
  name: string;
  description: string;
  isMandatory: boolean;
  prerequisites: string[];
  timeline: string;
  documentsRequired: string[];
}

export interface ComplianceReport {
  id: string;
  productDescription: string;
  originCountry: string;
  hsCode: string;
  hsDescription: string;
  dutyBreakdown: DutyBreakdown;
  ftaOptions: FTAOption[];
  certifications: CertificationRequirement[];
  antiDumpingDuties: AntiDumpingDuty[];
  dgftLicensing: DGFTLicensing | null;
  processSteps: ProcessStep[];
  riskSummary: string;
  regulatoryNotes: string;
  citations: Citation[];
  generatedAt: string;
}

export interface Citation {
  source: string;
  reference: string;
  date: string;
}

export interface ImportReportRequest {
  productDescription: string;
  originCountry: string;
  assessableValueUSD: number;
  hsCode?: string; // optional if user already knows
}
