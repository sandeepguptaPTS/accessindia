import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Scale } from "lucide-react";

export function BackedBySection() {
  return (
    <section className="py-16 md:py-20 bg-white border-t-2 border-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl text-[var(--navy)]">
            Backed By
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <Card className="border-[var(--gold)]/30 hover:border-[var(--gold)] transition-colors">
            <CardHeader>
              <div className="w-12 h-12 bg-[var(--navy)] rounded-lg flex items-center justify-center mb-3">
                <Building className="w-6 h-6 text-[var(--gold)]" />
              </div>
              <CardTitle className="text-lg text-[var(--navy)]">Omega QMS Private Limited</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">
                Founded in 2000. 25 years advising multinational corporations,
                global manufacturers, and industry bodies on India&apos;s
                regulatory framework. Policy interface with Central Government
                ministries. End-to-end import compliance across 10+ agencies.
              </p>
              <Link
                href="/about"
                className="text-sm font-medium text-[var(--gold)] hover:text-[var(--gold-hover)] transition-colors"
              >
                Learn more about our foundation &rarr;
              </Link>
            </CardContent>
          </Card>

          <Card className="border-[var(--gold)]/30 hover:border-[var(--gold)] transition-colors">
            <CardHeader>
              <div className="w-12 h-12 bg-[var(--navy)] rounded-lg flex items-center justify-center mb-3">
                <Scale className="w-6 h-6 text-[var(--gold)]" />
              </div>
              <CardTitle className="text-lg text-[var(--navy)]">Law Chambers of ARM</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">
                Tax &amp; Knowledge Partner: Law Chambers of Arjun Raghavendra M
                (ARM) — a multidisciplinary practice led by former Indian
                Revenue Service officers. Tax litigation before the Supreme
                Court, High Courts, and all Tribunals. GST policy drafting.
                Foreign trade disputes.
              </p>
              <a
                href="https://lawchambersofarm.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-[var(--gold)] hover:text-[var(--gold-hover)] transition-colors"
              >
                Visit lawchambersofarm.com &rarr;
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
