import Link from "next/link";
import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function ComplianceSearchSection() {
  return (
    <section className="py-12 md:py-16 bg-[var(--navy)]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <Badge className="bg-[var(--gold)] text-[var(--navy)] hover:bg-[var(--gold)] mb-4">
          Beta
        </Badge>
        <h2 className="font-serif text-3xl md:text-4xl text-white">
          Compliance Search Tool
        </h2>
        <p className="mt-4 text-white/60 max-w-3xl mx-auto">
          Try our import compliance search engine — type a product or HS code
          and get every duty, certification, licence, and risk in one search.
          264 compliance checks. 19 government sources. Now live in beta.
        </p>
        <div className="mt-8">
          <Link
            href="/search"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--gold)] text-[var(--navy)] font-semibold rounded-lg hover:bg-[var(--gold-hover)] transition-colors"
          >
            <Search className="w-4 h-4" />
            Try the Beta
          </Link>
        </div>
      </div>
    </section>
  );
}
