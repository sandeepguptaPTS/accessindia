import { getDB } from "@/lib/db/client";
import { ComplianceReportView } from "@/components/import-navigator/compliance-report";
import type { ComplianceReport } from "@/types/compliance-report";
import type { DBGeneratedReport } from "@/types/database";
import Link from "next/link";

interface ReportPageProps {
  params: Promise<{ id: string }>;
}

export default async function ReportPage({ params }: ReportPageProps) {
  const { id } = await params;
  const db = getDB();
  const row = db
    .prepare("SELECT * FROM generated_reports WHERE id = ?")
    .get(id) as DBGeneratedReport | undefined;

  if (!row) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-[var(--navy)] mb-4">
          Report Not Found
        </h1>
        <p className="text-gray-600 mb-8">
          This report may have been deleted or the link is invalid.
        </p>
        <Link
          href="/"
          className="inline-flex items-center px-4 py-2 bg-[var(--navy)] text-white rounded-lg hover:bg-[var(--deep-blue)]"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  let report: ComplianceReport;
  try {
    report = JSON.parse(row.report_content);
  } catch {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-[var(--navy)] mb-4">
          Report Data Corrupted
        </h1>
        <p className="text-gray-600 mb-8">
          This report&apos;s data could not be read. Please generate a new report.
        </p>
        <Link
          href="/search"
          className="inline-flex items-center px-4 py-2 bg-[var(--navy)] text-white rounded-lg hover:bg-[var(--deep-blue)]"
        >
          Generate New Report
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-gray-500">
            Generated {new Date(report.generatedAt).toLocaleString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        <Link
          href="/search"
          className="text-sm text-[var(--navy)] hover:text-[var(--deep-blue)] font-medium"
        >
          Generate New Report
        </Link>
      </div>
      <ComplianceReportView report={report} />
    </div>
  );
}
