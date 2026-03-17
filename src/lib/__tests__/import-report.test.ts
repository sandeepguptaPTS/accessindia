import { describe, it, expect } from "vitest";
import {
  generateDeterministicWarnings,
  parseReportSections,
} from "@/lib/ai/import-report";
import type {
  CertificationRequirement,
  AntiDumpingDuty,
} from "@/types/compliance-report";

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

  it("warns on pre-shipment certifications before mandatory ones", () => {
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

describe("parseReportSections", () => {
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
