export function WhyUsSection() {
  return (
    <section className="py-16 md:py-24 bg-[var(--light-bg)]">
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
              Our founders and advisors are former customs officers, trade policy makers,
              and regulatory insiders. We don&apos;t just understand compliance — we helped
              build the frameworks. That means faster resolution, fewer surprises,
              and advice grounded in how the system actually works.
            </p>
          </div>

          {/* Two supporting pillars stacked */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            <div className="border-l-4 border-[var(--gold)] pl-6">
              <h3 className="font-semibold text-xl text-[var(--navy)] mb-2">
                100% Compliance, No Shortcuts
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Every recommendation we make is backed by current law, official
                notifications, and deep regulatory knowledge. Your compliance is our reputation.
              </p>
            </div>

            <div className="border-l-4 border-[var(--gold)] pl-6">
              <h3 className="font-semibold text-xl text-[var(--navy)] mb-2">
                End-to-End, Not Piecemeal
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                From HS classification to customs clearance, from BIS certification to GST
                litigation — we handle the entire compliance chain so you don&apos;t coordinate
                between five different consultants.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
