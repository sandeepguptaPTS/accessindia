import { getDB } from "@/lib/db/client";
import { usePostgres, getReport } from "@/lib/db/postgres";
import { ComplianceReportView } from "@/components/import-navigator/compliance-report";
import type { ComplianceReport } from "@/types/compliance-report";
import type { DBGeneratedReport } from "@/types/database";
import Link from "next/link";

interface ReportPageProps {
  params: Promise<{ id: string }>;
}

export default async function ReportPage({ params }: ReportPageProps) {
  const { id } = await params;
  let row: DBGeneratedReport | undefined;
  if (usePostgres) {
    row = (await getReport(id)) ?? undefined;
  } else {
    const db = getDB();
    row = db
      .prepare("SELECT * FROM generated_reports WHERE id = ?")
      .get(id) as DBGeneratedReport | undefined;
  }

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
    <div>
      {/* Breadcrumb hero */}
      <section className="bg-[var(--navy)] py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-white/50" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-[var(--gold)] transition-colors">Home</Link>
            <span>/</span>
            <Link href="/search" className="hover:text-[var(--gold)] transition-colors">Compliance Search</Link>
            <span>/</span>
            <span className="text-white/80">Report</span>
          </nav>
          <p className="mt-2 text-xs text-white/40">
            Generated {new Date(report.generatedAt).toLocaleString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/search"
            className="inline-flex items-center gap-1 text-sm text-[var(--navy)] hover:text-[var(--deep-blue)] font-medium"
          >
            &larr; Back to Search
          </Link>
          <Link
            href="/search"
            className="text-sm text-gray-500 hover:text-[var(--navy)] font-medium"
          >
            Generate New Report
          </Link>
        </div>
        <ComplianceReportView report={report} />
      </div>
    </div>
  );
}
