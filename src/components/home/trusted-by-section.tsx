// Unique client list — duplicated in JSX for seamless marquee loop
const CLIENTS = ["Bahru Steels", "PUMA", "Motorola"];

export function TrustedBySection() {
  // Render two copies side-by-side so the marquee loops seamlessly
  const items = [...CLIENTS, ...CLIENTS];

  return (
    <section className="py-12 bg-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-gray-500 mb-6">
          Trusted by leading importers across electronics, steel, pharma, food, and consumer goods.
        </p>
        <div className="overflow-hidden">
          <div className="flex animate-marquee whitespace-nowrap">
            {items.map((client, i) => (
              <span
                key={i}
                className="mx-8 text-lg font-semibold text-[var(--navy)]/40 hover:text-[var(--navy)]/70 transition-colors"
              >
                {client}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
