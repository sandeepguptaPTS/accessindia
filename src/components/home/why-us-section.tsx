export function WhyUsSection() {
  return (
    <section className="py-16 md:py-24 bg-[var(--light-bg)] border-t-2 border-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-serif text-3xl md:text-4xl text-[var(--navy)] mb-10">
          Why Us
        </h2>

        {/* Asymmetric 2+1 layout — lead pillar is large, two supporting */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Lead pillar — spans 3 columns */}
          <div className="lg:col-span-3 bg-[var(--navy)] rounded-2xl p-8 md:p-10">
            <p className="text-[var(--gold)] text-sm font-semibold uppercase tracking-wider mb-3">
              Our Origin
            </p>
            <h3 className="font-serif text-2xl md:text-3xl text-white mb-4">
              We Come from the System
            </h3>
            <p className="text-white/70 leading-relaxed">
              Our leadership includes former customs officers, senior government
              officials, and regulatory professionals with decades inside the
              institutions you need to work with. We don&apos;t guess. We know.
            </p>
          </div>

          {/* Two supporting pillars stacked */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            <div className="border-l-4 border-[var(--gold)] pl-6">
              <h3 className="font-semibold text-xl text-[var(--navy)] mb-2">
                100% Compliance, No Shortcuts
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Every certification filed correctly. Every duty computed
                accurately. Every licence obtained before you ship. Zero
                detention. Zero penalties. Your interests protected.
              </p>
            </div>

            <div className="border-l-4 border-[var(--gold)] pl-6">
              <h3 className="font-semibold text-xl text-[var(--navy)] mb-2">
                End-to-End, Not Piecemeal
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Most consultants do one thing. We do everything — from policy
                advocacy to product certification at the factory to customs
                clearance at the port. One firm. One relationship. Complete
                coverage.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
