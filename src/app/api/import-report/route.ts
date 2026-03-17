import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { classifyHSCode } from "@/lib/ai/classify-hs";
import { buildComplianceContext } from "@/lib/rag/context-builder";
import { synthesizeComplianceReport } from "@/lib/ai/import-report";
import { loadHSCodeEmbeddings } from "@/lib/rag/vector-search";
import { getDB } from "@/lib/db/client";
import type { ComplianceReport, ImportReportRequest } from "@/types/compliance-report";

export async function POST(request: NextRequest) {
  try {
    const body: ImportReportRequest = await request.json();
    const { productDescription, originCountry, assessableValueUSD, hsCode } =
      body;

    if (
      !productDescription ||
      typeof productDescription !== "string" ||
      productDescription.trim().length < 3
    ) {
      return NextResponse.json(
        { error: "productDescription must be at least 3 characters" },
        { status: 400 }
      );
    }

    if (!originCountry || typeof originCountry !== "string" || originCountry.trim().length === 0) {
      return NextResponse.json(
        { error: "originCountry is required" },
        { status: 400 }
      );
    }

    if (
      typeof assessableValueUSD !== "number" ||
      !isFinite(assessableValueUSD) ||
      assessableValueUSD <= 0
    ) {
      return NextResponse.json(
        { error: "assessableValueUSD must be a positive number" },
        { status: 400 }
      );
    }

    // Load embeddings for vector search
    loadHSCodeEmbeddings();

    // Step 1: Classify HS code (or use provided one)
    let finalHsCode = hsCode || "";
    let finalHsDescription = "";

    if (!finalHsCode) {
      const classification = await classifyHSCode(
        productDescription,
        originCountry
      );
      finalHsCode = classification.hsCode;
      finalHsDescription = classification.description;

      if (classification.needsUserSelection) {
        return NextResponse.json({
          status: "needs_classification",
          classification,
        });
      }
    } else {
      // Look up description for provided HS code
      const db = getDB();
      const row = db
        .prepare("SELECT description FROM hs_codes WHERE code = ?")
        .get(finalHsCode) as { description: string } | undefined;
      finalHsDescription = row?.description || "";
    }

    // Step 2: Build compliance context from structured data
    const context = buildComplianceContext(
      finalHsCode,
      finalHsDescription,
      originCountry,
      assessableValueUSD
    );

    // Step 3: Synthesize report with Gemini
    const { riskSummary, regulatoryNotes } =
      await synthesizeComplianceReport(
        productDescription,
        originCountry,
        context
      );

    // Step 4: Assemble final report
    const report: ComplianceReport = {
      id: uuidv4(),
      productDescription,
      originCountry,
      hsCode: finalHsCode,
      hsDescription: finalHsDescription,
      dutyBreakdown: context.dutyBreakdown ?? {
        assessableValue: 0, currency: "INR", bcdRate: 0, bcdAmount: 0,
        aidcRate: 0, aidcAmount: 0, swsRate: 0, swsAmount: 0,
        igstRate: 0, igstAmount: 0, compensationCess: 0, totalDuty: 0, effectiveDutyRate: 0,
      },
      ftaOptions: context.ftaOptions,
      certifications: context.certifications,
      antiDumpingDuties: context.antiDumpingDuties,
      dgftLicensing: context.dgftLicensing,
      processSteps: context.processSteps,
      riskSummary,
      regulatoryNotes,
      citations: context.citations,
      generatedAt: new Date().toISOString(),
    };

    // Step 5: Save to database
    const db = getDB();
    db.prepare(
      "INSERT INTO generated_reports (id, tool, input_data, report_content, created_at) VALUES (?, ?, ?, ?, ?)"
    ).run(
      report.id,
      "import-navigator",
      JSON.stringify(body),
      JSON.stringify(report),
      report.generatedAt
    );

    return NextResponse.json({ status: "complete", report });
  } catch (error) {
    console.error("Import report error:", error);
    return NextResponse.json(
      { error: "Failed to generate compliance report" },
      { status: 500 }
    );
  }
}
