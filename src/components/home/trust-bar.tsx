const STATS = [
  { value: "25+", label: "Years Regulatory Leadership" },
  { value: "10+", label: "Government Agencies Covered" },
  { value: "45+", label: "Countries Served" },
  { value: "Fortune 500", label: "Client Portfolio" },
];

export function TrustBar() {
  return (
    <section className="bg-[var(--deep-blue)] py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-[var(--gold)] font-bold text-xl md:text-2xl">{stat.value}</p>
              <p className="text-white/60 text-xs md:text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
