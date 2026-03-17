import { Users, ShieldCheck, Layers } from "lucide-react";

const PILLARS = [
  {
    icon: Users,
    title: "We Come from the System",
    description:
      "Our founders and advisors are former customs officers, trade policy makers, and regulatory insiders. We don't just understand compliance — we helped build the frameworks.",
  },
  {
    icon: ShieldCheck,
    title: "100% Compliance, No Shortcuts",
    description:
      "We never cut corners. Every recommendation we make is backed by current law, official notifications, and deep regulatory knowledge. Your compliance is our reputation.",
  },
  {
    icon: Layers,
    title: "End-to-End, Not Piecemeal",
    description:
      "From HS classification to customs clearance, from BIS certification to GST litigation — we handle the entire compliance chain so you don't have to coordinate between five different consultants.",
  },
];

export function WhyUsSection() {
  return (
    <section className="py-16 md:py-20 bg-[var(--light-bg)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl text-[var(--navy)]">
            Why Us
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div key={pillar.title} className="text-center">
                <div className="w-14 h-14 bg-[var(--gold)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-7 h-7 text-[var(--gold)]" />
                </div>
                <h3 className="font-semibold text-lg text-[var(--navy)] mb-3">{pillar.title}</h3>
                <p className="text-sm text-gray-600">{pillar.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
