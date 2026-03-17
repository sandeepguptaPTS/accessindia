import type { Metadata } from "next";
import Link from "next/link";
import { Landmark, ShieldCheck, Scale, FileText, Receipt } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "Services — Access India AI Private Limited",
  description:
    "Policy & government interface, technical regulations, customs & trade optimization, DGFT licensing, GST & customs taxation. End-to-end import compliance.",
};

const SERVICES = [
  {
    slug: "policy-government",
    icon: Landmark,
    title: "Policy & Government Interface",
    description:
      "We represent businesses before Indian government agencies — CBIC, DGFT, BIS, FSSAI, CDSCO, WPC, PQ, and more. Our founders and advisors come from within these agencies, giving us unparalleled access and credibility.",
    capabilities: [
      "Pre-policy consultations and regulatory intelligence",
      "Government liaison and representation across 10+ agencies",
      "Regulatory change impact assessment",
      "Policy advocacy and industry representation",
      "New regulation onboarding and compliance roadmapping",
    ],
  },
  {
    slug: "technical-regulations",
    icon: ShieldCheck,
    title: "Technical Regulations & Product Compliance",
    description:
      "From BIS certification (CRS) to FSSAI licensing, WPC approvals to CDSCO registrations — we manage the entire product compliance lifecycle for goods entering India.",
    capabilities: [
      "BIS (Bureau of Indian Standards) certification and CRS registration",
      "FSSAI licensing and food safety compliance",
      "WPC (Wireless Planning Commission) approvals for RF equipment",
      "CDSCO registration for medical devices and pharmaceuticals",
      "Plant Quarantine (PQ) and phytosanitary compliance",
      "BEE (Bureau of Energy Efficiency) star labelling",
    ],
  },
  {
    slug: "customs-trade",
    icon: Scale,
    title: "Customs & Trade Optimisation",
    description:
      "We help importers minimize duty costs legally through FTA utilization, tariff engineering, and customs valuation optimization — while ensuring 100% compliance.",
    capabilities: [
      "HS code classification and tariff optimization",
      "Free Trade Agreement (FTA) utilization and rules of origin",
      "Anti-dumping and safeguard duty analysis",
      "Customs valuation and SVB (Special Valuation Branch) matters",
      "Customs audit support and compliance reviews",
      "Authorized Economic Operator (AEO) certification",
    ],
  },
  {
    slug: "dgft-licensing",
    icon: FileText,
    title: "DGFT & Import-Export Licensing",
    description:
      "Import licensing, export incentives, SCOMET clearances, and DGFT policy interpretation. We handle the full spectrum of Directorate General of Foreign Trade requirements.",
    capabilities: [
      "Import license applications (restricted items)",
      "SCOMET (Special Chemicals, Organisms, Materials, Equipment and Technologies) licensing",
      "Advance Authorization and DFIA schemes",
      "EPCG (Export Promotion Capital Goods) scheme management",
      "IEC (Import Export Code) registration and amendments",
      "DGFT policy interpretation and compliance advisory",
    ],
  },
  {
    slug: "gst-taxation",
    icon: Receipt,
    title: "GST, Customs Taxation & Tax Litigation",
    description:
      "In partnership with the Law Chambers of ARM, we provide end-to-end customs taxation advisory and litigation support — from GST on imports to customs tribunal representation.",
    capabilities: [
      "IGST on imports — classification, valuation, and refund claims",
      "Customs duty disputes and appeals",
      "CESTAT (Customs, Excise and Service Tax Appellate Tribunal) representation",
      "Anti-dumping duty investigations and responses",
      "Advance Ruling applications",
      "GST compliance for importers and cross-border transactions",
    ],
  },
];

function ServiceBody({ service }: { service: typeof SERVICES[number] }) {
  return (
    <>
      <p className="text-gray-600 mb-4">{service.description}</p>
      <ul className="space-y-2">
        {service.capabilities.map((cap) => (
          <li key={cap} className="flex items-start gap-2 text-sm text-gray-600">
            <span className="text-[var(--gold)] mt-0.5">&#10003;</span>
            {cap}
          </li>
        ))}
      </ul>
      <div className="mt-6">
        <Link
          href={`/contact?service=${service.slug}`}
          className="inline-flex items-center px-5 py-2.5 bg-[var(--gold)] text-[var(--navy)] font-semibold rounded-lg hover:bg-[#c49a3a] transition-colors text-sm"
        >
          Get a Quote
        </Link>
      </div>
    </>
  );
}

function ServiceCard({ service }: { service: typeof SERVICES[number] }) {
  const Icon = service.icon;
  return (
    <Card className="border-gray-200">
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[var(--navy)] rounded-lg flex items-center justify-center shrink-0">
            <Icon className="w-6 h-6 text-[var(--gold)]" />
          </div>
          <CardTitle className="text-xl text-[var(--navy)]">
            {service.title}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <ServiceBody service={service} />
      </CardContent>
    </Card>
  );
}

export default function ServicesPage() {
  // First 2 services are featured (always visible), rest in accordion
  const featured = SERVICES.slice(0, 2);
  const remaining = SERVICES.slice(2);

  return (
    <div>
      {/* Hero */}
      <section className="bg-[var(--navy)] py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-4xl md:text-5xl text-white">Our Services</h1>
          <p className="mt-4 text-lg text-white/70 max-w-2xl">
            Five integrated practices covering every aspect of Indian import
            compliance. One firm, end to end.
          </p>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {featured.map((service) => (
            <ServiceCard key={service.slug} service={service} />
          ))}

          {/* Remaining Services — collapsible */}
          <div>
            <h2 className="font-serif text-2xl text-[var(--navy)] mb-4">
              More Practices
            </h2>
            <Accordion type="multiple" className="space-y-3">
              {remaining.map((service) => {
                const Icon = service.icon;
                return (
                  <AccordionItem
                    key={service.slug}
                    value={service.slug}
                    className="border border-gray-200 rounded-lg px-6 data-[state=open]:border-[var(--gold)]/50"
                  >
                    <AccordionTrigger className="hover:no-underline py-5 hover:bg-[var(--light-bg)] -mx-6 px-6 rounded-lg transition-colors [&>svg]:text-[var(--gold)] [&>svg]:size-5">
                      <div className="flex items-center gap-4 text-left">
                        <div className="w-10 h-10 bg-[var(--navy)] rounded-lg flex items-center justify-center shrink-0">
                          <Icon className="w-5 h-5 text-[var(--gold)]" />
                        </div>
                        <span className="text-lg font-semibold text-[var(--navy)]">
                          {service.title}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-6">
                      <ServiceBody service={service} />
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[var(--gold)] py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-2xl text-[var(--navy)]">
            Not sure which service you need?
          </h2>
          <p className="mt-2 text-[var(--navy)]/70">
            Tell us about your situation and we&apos;ll recommend the right approach.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-flex items-center px-6 py-3 bg-[var(--navy)] text-white font-semibold rounded-lg hover:bg-[var(--deep-blue)] transition-colors"
          >
            Schedule a Free Consultation
          </Link>
        </div>
      </section>
    </div>
  );
}
