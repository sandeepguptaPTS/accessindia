import Link from "next/link";
import { Landmark, ShieldCheck, Scale } from "lucide-react";

const SERVICES = [
  {
    icon: Landmark,
    title: "Policy & Government Interface",
    description:
      "We represent businesses before Indian government agencies — CBIC, DGFT, BIS, FSSAI, CDSCO, and more. From pre-policy consultations to real-time regulatory response, we speak the language of Indian governance.",
  },
  {
    icon: ShieldCheck,
    title: "Import Compliance End-to-End",
    description:
      "HS classification, duty optimization, BIS/FSSAI/WPC certification management, DGFT licensing, and customs clearance. We handle everything from the first notification to the last customs stamp.",
  },
  {
    icon: Scale,
    title: "Customs & Trade Advisory",
    description:
      "FTA utilization, anti-dumping duty analysis, safeguard duty responses, SVB matters, customs audits, and trade litigation. We protect your margins while ensuring full compliance.",
  },
];

export function WhatWeDoSection() {
  return (
    <section className="py-16 md:py-20 bg-[var(--light-bg)]">
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
