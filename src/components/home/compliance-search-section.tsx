import Link from "next/link";
import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function ComplianceSearchSection() {
  return (
    <section className="py-12 md:py-16 bg-white border-t-2 border-gray-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <Badge className="bg-[var(--gold)] text-[var(--navy)] hover:bg-[var(--gold)] mb-4">
          Beta
        </Badge>
        <h2 className="font-serif text-3xl md:text-4xl text-[var(--navy)]">
          Import Compliance Search Engine
        </h2>
        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
          Try our AI-powered compliance search. Enter any product description
          and get instant HS classification, duty calculation, certification
          requirements, and a full regulatory report — powered by 264 checks
          across 19 government sources.
        </p>
        <div className="mt-8">
          <Link
            href="/search"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--navy)] text-white font-semibold rounded-lg hover:bg-[var(--deep-blue)] transition-colors"
          >
            <Search className="w-4 h-4" />
            Try the Beta
          </Link>
        </div>
      </div>
    </section>
  );
}
