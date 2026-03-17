import Link from "next/link";
import { Landmark, ShieldCheck, Scale } from "lucide-react";

const SERVICES = [
  {
    icon: Landmark,
    title: "Policy & Government Interface",
    description:
      "Central Government representations, ministry-level coordination, PLI advisory, trade remedy support, industry body submissions. We have the institutional relationships. You get the access.",
  },
  {
    icon: ShieldCheck,
    title: "Import Compliance \u2014 End to End",
    description:
      "Product certifications, BIS, QCO, food safety, wireless approvals, drug & device licensing, DGFT policy, customs duties, FTA optimisation, IEC/GST setup, CHA coordination. Every agency. Every clearance.",
  },
  {
    icon: Scale,
    title: "Customs & Trade Advisory",
    description:
      "HS classification, valuation, SVB, anti-dumping and trade remedy, AEO certification, MOOWR, FDI structuring. Complex problems solved by people who wrote the rules.",
  },
];

export function WhatWeDoSection() {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="font-serif text-3xl md:text-4xl text-[var(--navy)]">
            What We Do
          </h2>
          <p className="mt-4 text-gray-600 max-w-2xl">
            Three core practices, one integrated approach to Indian regulatory compliance.
          </p>
        </div>

        <div className="space-y-6">
          {SERVICES.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.title}
                className="flex items-start gap-5 p-6 rounded-xl border border-gray-200 hover:border-[var(--gold)]/50 transition-colors"
              >
                <div className="w-10 h-10 bg-[var(--navy)] rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                  <Icon className="w-5 h-5 text-[var(--gold)]" />
                </div>
                <div>
                  <h3 className="font-semibold text-xl text-[var(--navy)]">{service.title}</h3>
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed">{service.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-10">
          <Link
            href="/services"
            className="inline-flex items-center px-6 py-3 bg-[var(--navy)] text-white font-semibold rounded-lg hover:bg-[var(--deep-blue)] transition-colors"
          >
            Learn More
          </Link>
        </div>
      </div>
    </section>
  );
}
