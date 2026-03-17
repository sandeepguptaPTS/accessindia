"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { ProductInputForm } from "@/components/import-navigator/product-input-form";
import { HSCodeSelector } from "@/components/import-navigator/hs-code-selector";
import { ComplianceReportView } from "@/components/import-navigator/compliance-report";
import { Badge } from "@/components/ui/badge";
import type { ComplianceReport } from "@/types/compliance-report";
import type { ClassificationResult } from "@/types/hs-code";

type Step = "input" | "classify" | "report";

function SearchContent() {
  const searchParams = useSearchParams();
  const prefill = searchParams.get("q") || "";

  const [step, setStep] = useState<Step>("input");
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<ComplianceReport | null>(null);
  const [classification, setClassification] =
    useState<ClassificationResult | null>(null);
  const [formData, setFormData] = useState<{
    productDescription: string;
    originCountry: string;
    assessableValueUSD: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: {
    productDescription: string;
    originCountry: string;
    assessableValueUSD: number;
  }) => {
    setFormData(data);
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/import-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (result.status === "needs_classification") {
        setClassification(result.classification);
        setStep("classify");
      } else if (result.status === "complete") {
        setReport(result.report);
        setStep("report");
      } else if (result.error) {
        setError(result.error);
      }
    } catch {
      setError("Failed to generate report. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleHSCodeSelect = async (hsCode: string) => {
    if (!formData) return;
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/import-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, hsCode }),
      });

      const result = await res.json();
      if (result.status === "complete") {
        setReport(result.report);
        setStep("report");
      } else if (result.error) {
        setError(result.error);
      }
    } catch {
      setError("Failed to generate report. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setStep("input");
    setReport(null);
    setClassification(null);
    setFormData(null);
    setError(null);
  };

  return (
    <div>
      {/* Hero */}
      <section className="bg-[var(--navy)] py-16 md:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <h1 className="font-serif text-4xl md:text-5xl text-white">
              Compliance Search
            </h1>
            <Badge className="bg-[var(--gold)] text-[var(--navy)] hover:bg-[var(--gold)]">
              Beta
            </Badge>
          </div>
          <p className="mt-4 text-lg text-white/70">
            Enter your product details to get a complete, structured Indian
            import compliance report — covering duties, certifications, process
            registrations, licensing, and real risks.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-8">

      <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-700">
        Beta version. Data is indicative. Verify with official sources before
        making import decisions.
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
          <p className="mt-2 text-xs">
            This product may not be in our beta database.{" "}
            <a href="/contact" className="underline font-medium">
              Request a manual check
            </a>{" "}
            or email{" "}
            <a href="mailto:help@accessindia.ai" className="underline font-medium">
              help@accessindia.ai
            </a>
          </p>
        </div>
      )}

      {step === "input" && (
        <ProductInputForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
          defaultProduct={prefill}
        />
      )}

      {step === "classify" && classification && (
        <div className="space-y-4">
          <HSCodeSelector
            classification={classification}
            onSelect={handleHSCodeSelect}
          />
          {isLoading && (
            <div className="text-center py-4">
              <span className="animate-spin inline-block h-6 w-6 border-2 border-[var(--navy)] border-t-transparent rounded-full" />
              <p className="text-sm text-gray-500 mt-2">
                Generating report...
              </p>
            </div>
          )}
        </div>
      )}

      {step === "report" && report && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handleReset}
              className="text-sm text-[var(--navy)] hover:text-[var(--deep-blue)] font-medium"
            >
              &larr; New Search
            </button>
            <a
              href={`/report/${report.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-500 hover:text-[var(--navy)] font-medium"
            >
              Shareable Link &#8599;
            </a>
          </div>
          <ComplianceReportView report={report} />
        </div>
      )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-64" />
          <div className="h-4 bg-gray-200 rounded w-96" />
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
