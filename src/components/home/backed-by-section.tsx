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
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Two decades of institutional knowledge powering our compliance practice.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="border-[var(--gold)]/30 hover:border-[var(--gold)] transition-colors">
            <CardHeader>
              <div className="w-12 h-12 bg-[var(--navy)] rounded-lg flex items-center justify-center mb-3">
                <Building className="w-6 h-6 text-[var(--gold)]" />
              </div>
              <CardTitle className="text-lg text-[var(--navy)]">Omega QMS</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">
                Founded in 2000, Omega QMS has been at the forefront of quality
                management and regulatory compliance for over 25 years. Our deep
                expertise in Indian standards, certification systems, and
                government processes forms the backbone of AccessIndia&apos;s
                compliance practice.
              </p>
              <Link
                href="/about"
                className="text-sm font-medium text-[var(--gold)] hover:text-[#c49a3a] transition-colors"
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
                Our legal partnership with the Law Chambers of ARM brings
                specialized expertise in customs law, GST litigation, trade
                remedies, and regulatory advocacy. Together, we offer a
                compliance-to-litigation continuum that few firms can match.
              </p>
              <a
                href="https://lawchambersofarm.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-[var(--gold)] hover:text-[#c49a3a] transition-colors"
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
