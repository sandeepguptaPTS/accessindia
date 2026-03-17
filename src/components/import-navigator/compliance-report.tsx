"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import ReactMarkdown from "react-markdown";
import type { ComplianceReport as ComplianceReportType } from "@/types/compliance-report";

interface ComplianceReportProps {
  report: ComplianceReportType;
}

export function ComplianceReportView({ report }: ComplianceReportProps) {
  return (
    <div className="space-y-6">
      {/* Beta disclaimer */}
      <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-700">
        Beta version. Data is indicative. Verify with official sources before making import decisions.
      </div>

      {/* Risk Banner */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-red-800 flex items-center gap-2">
            <span className="text-xl">&#9888;</span> Risk Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none text-red-700 prose-strong:text-red-800 prose-li:text-red-700">
            <ReactMarkdown>{report.riskSummary}</ReactMarkdown>
          </div>
        </CardContent>
      </Card>

      {/* HS Classification */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">HS Classification</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="bg-[var(--light-bg)] rounded-lg px-4 py-2">
              <span className="font-mono text-2xl font-bold text-[var(--navy)]">
                {report.hsCode}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-600">{report.hsDescription}</p>
              <p className="text-xs text-gray-400 mt-1">
                Product: {report.productDescription} | Origin:{" "}
                {report.originCountry}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* DGFT Import Policy */}
      {report.dgftLicensing && (
        <Card
          className={
            report.dgftLicensing.classification === "restricted"
              ? "border-amber-200"
              : report.dgftLicensing.classification === "prohibited"
                ? "border-red-300"
                : ""
          }
        >
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              Import Policy (DGFT)
              <Badge
                variant={
                  report.dgftLicensing.classification === "free"
                    ? "secondary"
                    : report.dgftLicensing.classification === "restricted"
                      ? "outline"
                      : "destructive"
                }
                className={
                  report.dgftLicensing.classification === "free"
                    ? "bg-green-100 text-green-800"
                    : report.dgftLicensing.classification === "restricted"
                      ? "border-amber-500 text-amber-700"
                      : ""
                }
              >
                {report.dgftLicensing.classification.toUpperCase()}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div className="p-2 bg-gray-50 rounded">
                <span className="text-gray-500">SCOMET</span>
                <p className="font-medium">
                  {report.dgftLicensing.scometListed ? "Yes" : "No"}
                </p>
              </div>
              <div className="p-2 bg-gray-50 rounded">
                <span className="text-gray-500">EPR Required</span>
                <p className="font-medium">
                  {report.dgftLicensing.eprRequired ? "Yes" : "No"}
                </p>
              </div>
              <div className="p-2 bg-gray-50 rounded">
                <span className="text-gray-500">MoEF Permission</span>
                <p className="font-medium">
                  {report.dgftLicensing.moefPermission ? "Yes" : "No"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Duty Breakdown */}
      {report.dutyBreakdown && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Duty Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Assessable Value</span>
                <span className="font-mono">
                  INR{" "}
                  {report.dutyBreakdown.assessableValue.toLocaleString("en-IN")}
                </span>
              </div>
              <Separator />
              <DutyRow
                label="Basic Customs Duty (BCD)"
                rate={`${report.dutyBreakdown.bcdRate}%`}
                amount={report.dutyBreakdown.bcdAmount}
              />
              <DutyRow
                label="Agriculture Infrastructure Cess (AIDC)"
                rate={`${report.dutyBreakdown.aidcRate}%`}
                amount={report.dutyBreakdown.aidcAmount}
              />
              <DutyRow
                label="Social Welfare Surcharge (SWS)"
                rate={`${report.dutyBreakdown.swsRate}% on BCD`}
                amount={report.dutyBreakdown.swsAmount}
              />
              <DutyRow
                label="Integrated GST (IGST)"
                rate={`${report.dutyBreakdown.igstRate}%`}
                amount={report.dutyBreakdown.igstAmount}
              />
              {report.dutyBreakdown.compensationCess > 0 && (
                <DutyRow
                  label="Compensation Cess"
                  rate=""
                  amount={report.dutyBreakdown.compensationCess}
                />
              )}
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total Duty</span>
                <span className="font-mono text-[var(--navy)]">
                  INR{" "}
                  {report.dutyBreakdown.totalDuty.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Effective Duty Rate</span>
                <span className="font-mono">
                  {report.dutyBreakdown.effectiveDutyRate}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* FTA Options */}
      {report.ftaOptions.length > 0 && (
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="text-lg text-green-800">
              FTA Preferential Rates Available
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {report.ftaOptions.map((fta, i) => (
                <div key={i} className="p-3 bg-green-50 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-sm">{fta.agreementName}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Code: {fta.agreementCode}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono font-semibold text-green-700">
                        BCD: {fta.preferentialBcdRate}%
                      </p>
                      {fta.potentialSaving > 0 && (
                        <p className="text-xs text-green-600">
                          Save INR {fta.potentialSaving.toLocaleString("en-IN")}
                        </p>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Rules of Origin: {fta.rulesOfOrigin}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Anti-Dumping Duties */}
      {report.antiDumpingDuties.length > 0 && (
        <Card className="border-red-300 bg-red-50/50">
          <CardHeader>
            <CardTitle className="text-lg text-red-800 flex items-center gap-2">
              <span className="text-xl">&#9888;</span> Anti-Dumping / Safeguard Duties
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {report.antiDumpingDuties.map((ad, i) => (
                <div key={i} className="p-3 bg-white rounded-lg border border-red-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-sm text-red-900">
                        {ad.originCountry} — {ad.dutyType}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Notification: {ad.notificationNo}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono font-semibold text-red-700">
                        {ad.dutyType.toLowerCase().includes("ad valorem")
                          ? `${ad.dutyAmount}%`
                          : `USD ${ad.dutyAmount.toLocaleString("en-US")}/unit`}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Certifications */}
      {report.certifications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Certification Requirements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {report.certifications.map((cert, i) => (
                <div key={i} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={cert.isMandatory ? "destructive" : "secondary"}
                        >
                          {cert.isMandatory ? "Mandatory" : "Optional"}
                        </Badge>
                        {cert.preShipmentRequired && (
                          <Badge variant="outline" className="border-amber-500 text-amber-700">
                            Pre-Shipment
                          </Badge>
                        )}
                        <span className="font-semibold text-sm">
                          {cert.body}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mt-1">{cert.name}</p>
                    </div>
                  </div>
                  <p className="text-xs text-red-600 mt-2">
                    Risk: {cert.riskIfMissing}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {cert.processSummary}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Process Steps */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Import Process Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {report.processSteps.map((step, i) => (
              <div key={step.stepCode} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-[var(--navy)] text-white flex items-center justify-center text-sm font-semibold">
                    {i + 1}
                  </div>
                  {i < report.processSteps.length - 1 && (
                    <div className="w-px h-full bg-[var(--navy)]/20 mt-1" />
                  )}
                </div>
                <div className="pb-4 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm">{step.name}</p>
                    <Badge variant="outline" className="text-xs">
                      {step.stepCode}
                    </Badge>
                    {!step.isMandatory && (
                      <Badge variant="secondary" className="text-xs">
                        Optional
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {step.description}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Timeline: {step.timeline}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Regulatory Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Regulatory Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none text-gray-700 prose-strong:text-gray-900 prose-li:text-gray-700">
            <ReactMarkdown>{report.regulatoryNotes}</ReactMarkdown>
          </div>
        </CardContent>
      </Card>

      {/* Citations */}
      {report.citations.length > 0 && (
        <Card className="bg-gray-50">
          <CardHeader>
            <CardTitle className="text-sm text-gray-500">
              Sources & Citations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1">
              {report.citations.map((citation, i) => (
                <li key={i} className="text-xs text-gray-500">
                  [{i + 1}] {citation.source} — {citation.reference} (
                  {citation.date})
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Service CTA */}
      <Card className="bg-gradient-to-r from-[var(--navy)] to-[var(--deep-blue)] border-none">
        <CardContent className="pt-6">
          <div className="text-center">
            <h3 className="font-semibold text-white">
              Need Professional Assistance?
            </h3>
            <p className="text-sm text-white/70 mt-2">
              Our expert team can help with customs clearance, certification,
              and regulatory compliance for your India imports.
            </p>
            <div className="mt-4 flex gap-3 justify-center no-print">
              <a
                href={`mailto:help@accessindia.ai?subject=${encodeURIComponent(`Import Advisory Request — ${report.productDescription} (HS ${report.hsCode}) from ${report.originCountry}`)}`}
                className="px-4 py-2 bg-[var(--gold)] text-[var(--navy)] rounded-lg text-sm font-medium hover:bg-[var(--gold-hover)] transition-colors inline-block"
              >
                Book a Consultation
              </a>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 border border-white/30 text-white rounded-lg text-sm font-medium hover:bg-white/10 transition-colors"
              >
                Download PDF Report
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function DutyRow({
  label,
  rate,
  amount,
}: {
  label: string;
  rate: string;
  amount: number;
}) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-600">
        {label} {rate && <span className="text-gray-400">({rate})</span>}
      </span>
      <span className="font-mono">INR {amount.toLocaleString("en-IN")}</span>
    </div>
  );
}
