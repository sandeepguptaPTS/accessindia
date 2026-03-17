const CLIENTS = ["Bahru Steels", "PUMA", "Motorola"];

export function TrustedBySection() {
  return (
    <section className="py-12 bg-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-gray-500 mb-6">
          Trusted by leading importers across electronics, steel, pharma, food, and consumer goods.
        </p>
        <div className="flex justify-center items-center gap-12 flex-wrap">
          {CLIENTS.map((client) => (
            <span
              key={client}
              className="text-lg font-semibold text-[var(--navy)]/40"
            >
              {client}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
