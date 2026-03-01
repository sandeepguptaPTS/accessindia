import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-orange-50 to-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="outline" className="mb-4">
            AI-Powered Advisory Platform
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 max-w-3xl mx-auto leading-tight">
            Navigate India&apos;s Import Regulations{" "}
            <span className="text-orange-600">with Confidence</span>
          </h1>
          <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
            Instant compliance reports for importing goods into India. HS code
            classification, duty calculations, certification requirements, and
            regulatory guidance — powered by curated official data.
          </p>
        </div>
      </section>

      {/* Tools */}
      <section className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">
            Our Tools
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Link href="/import-navigator">
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer border-orange-200 hover:border-orange-400">
                <CardHeader>
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-2">
                    <span className="text-2xl">&#128666;</span>
                  </div>
                  <CardTitle>Import Compliance Navigator</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">
                    Enter a product description and get a complete compliance
                    report: HS code classification, duty breakdown, required
                    certifications, licensing status, and step-by-step import
                    process.
                  </p>
                  <ul className="text-xs text-gray-500 space-y-1">
                    <li>&#10003; Automated HS code classification</li>
                    <li>&#10003; Deterministic duty calculation (BCD + AIDC + SWS + IGST)</li>
                    <li>&#10003; FTA preferential rates &amp; savings</li>
                    <li>&#10003; BIS, FSSAI, WPC certification checks</li>
                    <li>&#10003; DGFT import policy (free/restricted/prohibited)</li>
                  </ul>
                  <div className="mt-4">
                    <span className="text-sm font-medium text-orange-600">
                      Try it now &rarr;
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Card className="h-full opacity-60 cursor-not-allowed">
              <CardHeader>
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-2xl">&#127970;</span>
                </div>
                <div className="flex items-center gap-2">
                  <CardTitle>India Market Access Report</CardTitle>
                  <Badge variant="secondary">Coming Soon</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">
                  Get a mini project report for entering the Indian market:
                  FDI routes, entity setup, incentives (PLI), bilateral
                  agreements, regulatory roadmap, and risk assessment.
                </p>
                <ul className="text-xs text-gray-500 space-y-1">
                  <li>&#10003; FDI policy &amp; entry route analysis</li>
                  <li>&#10003; Entity structure recommendations</li>
                  <li>&#10003; PLI &amp; incentive scheme matching</li>
                  <li>&#10003; Bilateral agreement benefits</li>
                  <li>&#10003; Regulatory timeline &amp; risk assessment</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">
            Built on Official Data Sources
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              {
                name: "CBIC",
                desc: "Customs Tariff & Duty Rates",
              },
              {
                name: "DGFT",
                desc: "Import-Export Policy & Licensing",
              },
              {
                name: "BIS",
                desc: "Product Standards & QCOs",
              },
              {
                name: "FSSAI",
                desc: "Food Safety Standards",
              },
            ].map((source) => (
              <div
                key={source.name}
                className="text-center p-4 bg-white rounded-lg shadow-sm"
              >
                <p className="font-bold text-gray-900">{source.name}</p>
                <p className="text-xs text-gray-500 mt-1">{source.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: "1",
                title: "Describe Your Product",
                desc: "Enter your product description, country of origin, and shipment value. Our AI classifies the HS code automatically.",
              },
              {
                step: "2",
                title: "We Analyze Regulations",
                desc: "We query curated customs data — duty rates, FTA benefits, BIS/FSSAI certifications, DGFT licensing — and calculate exact duties.",
              },
              {
                step: "3",
                title: "Get Your Report",
                desc: "Receive a comprehensive compliance report with duty breakdown, required certifications, risk alerts, and step-by-step import process.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-10 h-10 bg-orange-600 text-white rounded-full flex items-center justify-center mx-auto font-bold">
                  {item.step}
                </div>
                <h3 className="font-semibold text-gray-900 mt-4">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 mt-2">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
