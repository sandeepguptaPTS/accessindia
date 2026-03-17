import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative bg-[var(--navy)] overflow-hidden">
      {/* CSS dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: "radial-gradient(circle, #D4A843 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-34">
        <div className="max-w-3xl">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white leading-tight">
            Policy. Regulatory.{" "}
            <span className="text-[var(--gold)]">Import Compliance.</span>{" "}
            End to End.
          </h1>
          <p className="mt-6 text-lg md:text-xl text-white/70 max-w-2xl">
            Founded by former customs officers with over 25 years of regulatory
            leadership, we help businesses navigate India&apos;s complex import
            landscape with confidence and full compliance.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/services"
              className="px-6 py-3 bg-[var(--gold)] text-[var(--navy)] font-semibold rounded-lg hover:bg-[#c49a3a] transition-colors"
            >
              Explore Our Services
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 border border-white/30 text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
            >
              Schedule a Consultation
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
