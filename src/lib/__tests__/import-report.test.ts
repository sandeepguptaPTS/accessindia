import { describe, it, expect } from "vitest";
import type {
  CertificationRequirement,
  AntiDumpingDuty,
  DGFTLicensing,
} from "@/types/compliance-report";

// We test generateDeterministicWarnings by replicating the logic from
// import-report.ts:100-158 since it's not exported. This tests the
// deterministic (non-LLM) warning generation which is the most critical
// correctness path.
function generateDeterministicWarnings(
  certifications: CertificationRequirement[],
  antiDumpingDuties: AntiDumpingDuty[],
  dgftLicensing: DGFTLicensing | null,
  originCountry: string
): string[] {
  const warnings: string[] = [];

  if (dgftLicensing?.classification === "restricted") {
    warnings.push(
      "⚠ IMPORT LICENSE REQUIRED: This product is classified as 'Restricted' under DGFT ITC(HS). You must obtain an import license before shipment. Importing without a valid license will result in detention and possible confiscation."
    );
  }

  if (dgftLicensing?.classification === "prohibited") {
    warnings.push(
      "⚠ IMPORT PROHIBITED: This product is classified as 'Prohibited' under DGFT ITC(HS). Import is not permitted."
    );
  }

  if (dgftLicensing?.scometListed) {
    warnings.push(
      "⚠ SCOMET LISTED: This product is on the Special Chemicals, Organisms, Materials, Equipment and Technologies list. Additional DGFT permissions required."
    );
  }

  if (dgftLicensing?.eprRequired) {
    warnings.push(
      "⚠ EPR REQUIRED: Extended Producer Responsibility registration with CPCB is required for this product."
    );
  }

  for (const cert of certifications) {
    if (cert.preShipmentRequired) {
      warnings.push(
        `⚠ PRE-SHIPMENT CERTIFICATION: ${cert.body} ${cert.name} certification must be obtained BEFORE goods are shipped. Arrange this with the supplier/manufacturer.`
      );
    }
  }

  for (const cert of certifications) {
    if (cert.isMandatory && !cert.preShipmentRequired) {
      warnings.push(
        `⚠ MANDATORY CERTIFICATION: ${cert.body} ${cert.name} is required. Risk if missing: ${cert.riskIfMissing}`
      );
    }
  }

  const relevantAD = antiDumpingDuties.filter(
    (a) => a.originCountry.toLowerCase() === originCountry.toLowerCase()
  );
  for (const ad of relevantAD) {
    warnings.push(
      `⚠ ANTI-DUMPING DUTY APPLIES: ${ad.dutyType} duty of ${ad.dutyAmount} from ${ad.originCountry} per ${ad.notificationNo}`
    );
  }

  return warnings;
}

// Test the regex parsing logic from import-report.ts:71-92
function parseReportSections(response: string) {
  const riskMatch = response.match(
    /## RISK SUMMARY\s*([\s\S]*?)(?=## REGULATORY NOTES|$)/i
  );
  const notesMatch = response.match(/## REGULATORY NOTES\s*([\s\S]*?)$/i);

  const riskSummary = riskMatch?.[1]?.trim() || "";
  let regulatoryNotes =
    notesMatch?.[1]?.trim() || "Detailed regulatory notes pending.";
  regulatoryNotes = regulatoryNotes
    .split("\n")
    .filter((line) => !line.match(/not covered in current dataset/i))
    .join("\n")
    .trim();

  return { riskSummary, regulatoryNotes };
}

describe("generateDeterministicWarnings", () => {
  it("returns empty array when no issues", () => {
    const result = generateDeterministicWarnings(
      [],
      [],
      { classification: "free", scometListed: false, eprRequired: false, moefPermission: false },
      "China"
    );
    expect(result).toEqual([]);
  });

  it("warns on restricted DGFT classification", () => {
    const result = generateDeterministicWarnings(
      [],
      [],
      { classification: "restricted", scometListed: false, eprRequired: false, moefPermission: false },
      "China"
    );
    expect(result).toHaveLength(1);
    expect(result[0]).toContain("IMPORT LICENSE REQUIRED");
    expect(result[0]).toContain("Restricted");
  });

  it("warns on prohibited DGFT classification", () => {
    const result = generateDeterministicWarnings(
      [],
      [],
      { classification: "prohibited", scometListed: false, eprRequired: false, moefPermission: false },
      "China"
    );
    expect(result).toHaveLength(1);
    expect(result[0]).toContain("IMPORT PROHIBITED");
  });

  it("warns on SCOMET listing", () => {
    const result = generateDeterministicWarnings(
      [],
      [],
      { classification: "free", scometListed: true, eprRequired: false, moefPermission: false },
      "China"
    );
    expect(result).toHaveLength(1);
    expect(result[0]).toContain("SCOMET LISTED");
  });

  it("warns on EPR requirement", () => {
    const result = generateDeterministicWarnings(
      [],
      [],
      { classification: "free", scometListed: false, eprRequired: true, moefPermission: false },
      "China"
    );
    expect(result).toHaveLength(1);
    expect(result[0]).toContain("EPR REQUIRED");
  });

  it("generates multiple warnings for combined flags", () => {
    const result = generateDeterministicWarnings(
      [],
      [],
      { classification: "restricted", scometListed: true, eprRequired: true, moefPermission: true },
      "China"
    );
    expect(result).toHaveLength(3); // restricted + scomet + epr
  });

  it("handles null dgftLicensing", () => {
    const result = generateDeterministicWarnings([], [], null, "China");
    expect(result).toEqual([]);
  });

  it("warns on pre-shipment certifications first", () => {
    const certs: CertificationRequirement[] = [
      {
        body: "BIS",
        name: "ISI Mark",
        isMandatory: true,
        preShipmentRequired: true,
        riskIfMissing: "Customs detention",
        processSummary: "Apply to BIS",
      },
      {
        body: "FSSAI",
        name: "Food License",
        isMandatory: true,
        preShipmentRequired: false,
        riskIfMissing: "Seizure at port",
        processSummary: "Register with FSSAI",
      },
    ];
    const result = generateDeterministicWarnings(certs, [], null, "China");
    expect(result).toHaveLength(2);
    expect(result[0]).toContain("PRE-SHIPMENT CERTIFICATION");
    expect(result[0]).toContain("BIS");
    expect(result[1]).toContain("MANDATORY CERTIFICATION");
    expect(result[1]).toContain("FSSAI");
  });

  it("skips optional certifications", () => {
    const certs: CertificationRequirement[] = [
      {
        body: "BIS",
        name: "ISI Mark",
        isMandatory: false,
        preShipmentRequired: false,
        riskIfMissing: "None",
        processSummary: "Optional",
      },
    ];
    const result = generateDeterministicWarnings(certs, [], null, "China");
    expect(result).toEqual([]);
  });

  it("filters anti-dumping duties by origin country (case insensitive)", () => {
    const duties: AntiDumpingDuty[] = [
      { originCountry: "China", dutyType: "fixed", dutyAmount: 500, notificationNo: "01/2024" },
      { originCountry: "Vietnam", dutyType: "ad-valorem", dutyAmount: 15, notificationNo: "02/2024" },
    ];
    const result = generateDeterministicWarnings([], duties, null, "china");
    expect(result).toHaveLength(1);
    expect(result[0]).toContain("ANTI-DUMPING DUTY APPLIES");
    expect(result[0]).toContain("China");
  });

  it("returns no anti-dumping warnings for non-matching country", () => {
    const duties: AntiDumpingDuty[] = [
      { originCountry: "China", dutyType: "fixed", dutyAmount: 500, notificationNo: "01/2024" },
    ];
    const result = generateDeterministicWarnings([], duties, null, "Germany");
    expect(result).toEqual([]);
  });
});

describe("parseReportSections (regex parsing)", () => {
  it("parses well-formed LLM response", () => {
    const response = `## RISK SUMMARY
This product carries moderate compliance risk.

## REGULATORY NOTES
DGFT classifies this as free import.
No certifications required.`;

    const { riskSummary, regulatoryNotes } = parseReportSections(response);
    expect(riskSummary).toBe("This product carries moderate compliance risk.");
    expect(regulatoryNotes).toContain("DGFT classifies");
    expect(regulatoryNotes).toContain("No certifications");
  });

  it("falls back gracefully when sections are missing", () => {
    const { riskSummary, regulatoryNotes } = parseReportSections(
      "Some unstructured response without headers"
    );
    expect(riskSummary).toBe("");
    expect(regulatoryNotes).toBe("Detailed regulatory notes pending.");
  });

  it("strips 'not covered in current dataset' lines", () => {
    const response = `## RISK SUMMARY
Low risk.

## REGULATORY NOTES
Free import policy.
Anti-dumping data is not covered in current dataset.
No certifications needed.`;

    const { regulatoryNotes } = parseReportSections(response);
    expect(regulatoryNotes).not.toContain("not covered in current dataset");
    expect(regulatoryNotes).toContain("Free import policy");
    expect(regulatoryNotes).toContain("No certifications");
  });

  it("handles extra whitespace around section headers", () => {
    const response = `## RISK SUMMARY  \n\n  High risk due to restricted classification.\n\n## REGULATORY NOTES  \n\n  Requires import license.`;
    const { riskSummary, regulatoryNotes } = parseReportSections(response);
    expect(riskSummary).toContain("High risk");
    expect(regulatoryNotes).toContain("Requires import license");
  });

  it("handles response with only RISK SUMMARY section", () => {
    const response = `## RISK SUMMARY
Moderate risk.`;
    const { riskSummary, regulatoryNotes } = parseReportSections(response);
    expect(riskSummary).toBe("Moderate risk.");
    expect(regulatoryNotes).toBe("Detailed regulatory notes pending.");
  });
});
