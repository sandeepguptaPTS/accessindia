import Link from "next/link";
import { Landmark, ShieldCheck, Scale } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl text-[var(--navy)]">
            What We Do
          </h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Three core practices, one integrated approach to Indian regulatory compliance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {SERVICES.map((service) => {
            const Icon = service.icon;
            return (
              <Card key={service.title} className="border-gray-200 hover:border-[var(--gold)] transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 bg-[var(--navy)] rounded-lg flex items-center justify-center mb-3">
                    <Icon className="w-6 h-6 text-[var(--gold)]" />
                  </div>
                  <CardTitle className="text-lg text-[var(--navy)]">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">{service.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-10">
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
