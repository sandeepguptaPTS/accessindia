import { getDB } from "@/lib/db/client";
import type {
  DutyBreakdown,
  FTAOption,
  CertificationRequirement,
  AntiDumpingDuty,
  DGFTLicensing,
  ProcessStep,
} from "@/types/compliance-report";
import type {
  DBDutyRate,
  DBFTARate,
  DBAntiDumpingDuty,
  DBCertification,
  DBDGFTLicensing,
  DBProcessStep,
} from "@/types/database";

const FTA_MEMBER_COUNTRIES: Record<string, string[]> = {
  AIFTA: ["brunei", "cambodia", "indonesia", "laos", "malaysia", "myanmar", "philippines", "singapore", "thailand", "vietnam"],
  "CEPA-UAE": ["united arab emirates", "uae"],
  "ECTA-AUS": ["australia"],
  "CEPA-KOR": ["south korea", "korea"],
  "CEPA-JPN": ["japan"],
  SAFTA: ["afghanistan", "bangladesh", "bhutan", "maldives", "nepal", "pakistan", "sri lanka"],
  "CEPA-UK": ["united kingdom", "uk", "great britain", "england", "scotland", "wales", "northern ireland"],
  "FTA-NZ": ["new zealand", "nz"],
  "CECPA-MUS": ["mauritius"],
};

export function lookupDutyRates(hsCode: string): DBDutyRate | null {
  const db = getDB();
  return (
    (db
      .prepare("SELECT * FROM duty_rates WHERE hs_code = ?")
      .get(hsCode) as DBDutyRate) || null
  );
}

export function lookupFTARates(hsCode: string, originCountry?: string): FTAOption[] {
  const db = getDB();
  const rows = db
    .prepare("SELECT * FROM fta_rates WHERE hs_code = ?")
    .all(hsCode) as DBFTARate[];

  const toFTAOption = (r: DBFTARate): FTAOption => ({
    agreementCode: r.agreement_code,
    agreementName: r.agreement_name,
    preferentialBcdRate: r.preferential_bcd_rate,
    rulesOfOrigin: r.rules_of_origin,
    potentialSaving: 0, // calculated later
  });

  if (originCountry) {
    const country = originCountry.toLowerCase();
    return rows
      .filter((r) => {
        const members = FTA_MEMBER_COUNTRIES[r.agreement_code];
        return members ? members.some((m) => m === country || country.includes(m)) : false;
      })
      .map(toFTAOption);
  }

  return rows.map(toFTAOption);
}

export function lookupAntiDumpingDuties(
  hsCode: string,
  originCountry?: string
): AntiDumpingDuty[] {
  const db = getDB();
  let rows: DBAntiDumpingDuty[];

  if (originCountry) {
    rows = db
      .prepare(
        "SELECT * FROM anti_dumping_duties WHERE hs_code = ? AND LOWER(origin_country) = LOWER(?)"
      )
      .all(hsCode, originCountry) as DBAntiDumpingDuty[];
  } else {
    rows = db
      .prepare("SELECT * FROM anti_dumping_duties WHERE hs_code = ?")
      .all(hsCode) as DBAntiDumpingDuty[];
  }

  return rows.map((r) => ({
    originCountry: r.origin_country,
    dutyType: r.duty_type,
    dutyAmount: r.duty_amount,
    notificationNo: r.notification_no,
  }));
}

export function lookupCertifications(
  hsCode: string
): CertificationRequirement[] {
  const db = getDB();
  const allCerts = db
    .prepare("SELECT * FROM certifications")
    .all() as DBCertification[];

  return allCerts
    .filter((cert) => {
      try {
        const applicableCodes: string[] = JSON.parse(cert.applicable_hs_codes);
        return applicableCodes.includes(hsCode);
      } catch {
        return false;
      }
    })
    .map((cert) => ({
      body: cert.body,
      name: cert.name,
      isMandatory: cert.is_mandatory === 1,
      preShipmentRequired: cert.pre_shipment_required === 1,
      riskIfMissing: cert.risk_if_missing,
      processSummary: cert.process_summary,
    }));
}

export function lookupDGFTLicensing(hsCode: string): DGFTLicensing | null {
  const db = getDB();
  const row = db
    .prepare("SELECT * FROM dgft_licensing WHERE hs_code = ?")
    .get(hsCode) as DBDGFTLicensing | undefined;

  if (!row) return null;

  return {
    classification: row.classification as "free" | "restricted" | "prohibited",
    scometListed: row.scomet_listed === 1,
    eprRequired: row.epr_required === 1,
    moefPermission: row.moef_permission === 1,
  };
}

export function lookupProcessSteps(): ProcessStep[] {
  const db = getDB();
  const rows = db
    .prepare("SELECT * FROM process_steps ORDER BY sort_order ASC")
    .all() as DBProcessStep[];

  return rows.map((r) => {
    let prerequisites: string[] = [];
    let documentsRequired: string[] = [];
    try { prerequisites = JSON.parse(r.prerequisites); } catch { /* use default */ }
    try { documentsRequired = JSON.parse(r.documents_required); } catch { /* use default */ }
    return {
      stepCode: r.step_code,
      name: r.name,
      description: r.description,
      isMandatory: r.is_mandatory === 1,
      prerequisites,
      timeline: r.timeline,
      documentsRequired,
    };
  });
}
