import { generateText } from "./gemini";
import type { ComplianceContext } from "@/lib/rag/context-builder";
import type {
  CertificationRequirement,
  AntiDumpingDuty,
  DGFTLicensing,
  ProcessStep,
} from "@/types/compliance-report";

const DISCLAIMER =
  "Note: This summary is generated from the regulatory data shown in this report. For binding compliance advice, consult a licensed customs broker or refer to the latest CBIC/DGFT notifications.";

export async function synthesizeComplianceReport(
  productDescription: string,
  originCountry: string,
  context: ComplianceContext
): Promise<{ riskSummary: string; regulatoryNotes: string }> {
  const structuredData = formatContextForPrompt(context);
  const deterministicWarnings = generateDeterministicWarnings(
    context.certifications,
    context.antiDumpingDuties,
    context.dgftLicensing,
    originCountry
  );

  const warningsText = deterministicWarnings.length > 0
    ? deterministicWarnings.join("\n")
    : "None";

  const systemInstruction = `You are a compliance analyst synthesizing insights from structured regulatory data. Your job is to highlight what matters most — risks, savings opportunities, dependencies, and bottlenecks.

ABSOLUTE RULES:
- Use ONLY the data provided below. Do not add ANY information from your own knowledge.
- Do not invent timelines, processing durations, or requirements not explicitly stated in the data.
- Do not speculate about country-specific risks unless anti-dumping or FTA data is provided for that country.
- If a data category has no entries, either state the negative finding (e.g., "no certifications required") or omit the paragraph — NEVER write "not covered in current dataset".`;

  const prompt = `Analyze this import scenario and produce a risk summary and regulatory notes.

**Product:** ${productDescription}
**Origin Country:** ${originCountry}
**HS Code:** ${context.hsCode} — ${context.hsDescription}

**Structured Data (from official sources):**
${structuredData}

**Warnings already shown to the user (DO NOT restate these):**
${warningsText}

Respond with TWO sections:

## RISK SUMMARY
2-3 sentences. Lead with the single most impactful compliance finding. If FTA savings exist, mention the specific INR amount. Do NOT restate the warnings listed above — they are already displayed separately.

## REGULATORY NOTES
3-4 paragraphs. Follow these rules strictly:

1. **DGFT & Licensing:** State the import policy classification. If EPR or MoEF permissions apply, explain what they mean practically. Do NOT restate warnings already shown above.
2. **Certifications:** If the certifications list is EMPTY, explicitly state "No product-specific certifications (BIS, FSSAI, etc.) are required for this HS code." If certifications exist, focus on timeline implications and process dependencies — not restating the fields verbatim.
3. **FTA Opportunities:** If FTAs apply, state the agreement name and specific INR savings amount. Mention rules of origin requirements. If NO FTAs apply for this origin country, state: "No preferential trade agreements apply for imports from ${originCountry} under this HS code."
4. **Anti-Dumping:** If anti-dumping data exists in the structured data, summarize the duty type and amount. If NO anti-dumping data exists, omit this paragraph entirely — do not mention anti-dumping at all.

Do NOT enumerate or restate process steps (they are shown separately). Instead, if process data is available, highlight the longest-lead registration item or any dependency bottleneck (e.g., "BIS registration typically takes X and must be completed before customs clearance").
Do not repeat exact duty percentages or amounts (shown separately in the report).`;

  const response = await generateText(prompt, systemInstruction, {
    temperature: 0.2,
  });

  const { riskSummary: parsedRisk, regulatoryNotes } = parseReportSections(response);

  // Build risk summary: deterministic warnings first, then LLM summary
  const riskParts: string[] = [];
  if (deterministicWarnings.length > 0) {
    riskParts.push(deterministicWarnings.join("\n"));
  }
  if (parsedRisk) {
    riskParts.push(parsedRisk);
  }
  riskParts.push(DISCLAIMER);

  return {
    riskSummary: riskParts.join("\n\n") || "Risk assessment pending.",
    regulatoryNotes,
  };
}

export function parseReportSections(response: string): { riskSummary: string; regulatoryNotes: string } {
  const riskMatch = response.match(
    /## RISK SUMMARY\s*([\s\S]*?)(?=## REGULATORY NOTES|$)/i
  );
  const notesMatch = response.match(/## REGULATORY NOTES\s*([\s\S]*?)$/i);

  const riskSummary = riskMatch?.[1]?.trim() || "";
  let regulatoryNotes = notesMatch?.[1]?.trim() || "Detailed regulatory notes pending.";
  regulatoryNotes = regulatoryNotes
    .split("\n")
    .filter((line) => !line.match(/not covered in current dataset/i))
    .join("\n")
    .trim();

  return {
    riskSummary,
    regulatoryNotes: regulatoryNotes || "Detailed regulatory notes pending.",
  };
}

export function generateDeterministicWarnings(
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

function formatContextForPrompt(context: ComplianceContext): string {
  const parts: string[] = [];

  if (context.dutyBreakdown) {
    const d = context.dutyBreakdown;
    parts.push(
      `**Duty Rates:** BCD ${d.bcdRate}%, SWS ${d.swsRate}% on BCD, IGST ${d.igstRate}%, Effective total duty rate: ${d.effectiveDutyRate}%`
    );
  }

  if (context.ftaOptions.length > 0) {
    const ftaList = context.ftaOptions
      .map(
        (f) =>
          `- ${f.agreementName} (${f.agreementCode}): Preferential BCD ${f.preferentialBcdRate}% (saving: ${f.potentialSaving} INR). ROO: ${f.rulesOfOrigin}`
      )
      .join("\n");
    parts.push(`**FTA Options:**\n${ftaList}`);
  }

  if (context.antiDumpingDuties.length > 0) {
    const adList = context.antiDumpingDuties
      .map(
        (a) =>
          `- ${a.originCountry}: ${a.dutyType} duty of ${a.dutyAmount} (${a.notificationNo})`
      )
      .join("\n");
    parts.push(`**Anti-Dumping Duties:**\n${adList}`);
  }

  if (context.certifications.length > 0) {
    const certList = context.certifications
      .map(
        (c) =>
          `- ${c.body} — ${c.name}: ${c.isMandatory ? "MANDATORY" : "Optional"}. Pre-shipment: ${c.preShipmentRequired ? "YES" : "No"}. Risk: ${c.riskIfMissing}. Process: ${c.processSummary}`
      )
      .join("\n");
    parts.push(`**Certifications Required:**\n${certList}`);
  }

  if (context.dgftLicensing) {
    const d = context.dgftLicensing;
    parts.push(
      `**DGFT Import Policy:** Classification: ${d.classification.toUpperCase()}. SCOMET: ${d.scometListed ? "YES" : "No"}. EPR Required: ${d.eprRequired ? "YES" : "No"}. MoEF Permission: ${d.moefPermission ? "YES" : "No"}`
    );
  }

  if (context.processSteps.length > 0) {
    const stepList = context.processSteps
      .map(
        (s: ProcessStep) =>
          `- Step ${s.stepCode}: ${s.name} (${s.isMandatory ? "Mandatory" : "Optional"}, Timeline: ${s.timeline}). ${s.description}`
      )
      .join("\n");
    parts.push(`**Import Process Steps:**\n${stepList}`);
  }

  return parts.join("\n\n");
}
