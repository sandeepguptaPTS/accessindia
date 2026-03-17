"use client";

import { useCountUp } from "@/lib/hooks/use-count-up";

const NUMBERS = [
  { end: 264, suffix: "", label: "Regulatory checks per product" },
  { end: 19, suffix: "", label: "Government data sources" },
  { end: 11500, suffix: "+", label: "HS codes in Indian customs tariff" },
  { end: 45, suffix: "+", label: "Countries served" },
  { end: 25, suffix: "+", label: "Years of regulatory experience" },
  { end: 10, suffix: "+", label: "Government agencies covered" },
];

function AnimatedNumber({ end, suffix, label }: { end: number; suffix: string; label: string }) {
  const { count, ref } = useCountUp(end, 2000);

  return (
    <div ref={ref} className="text-center">
      <p className="text-[var(--gold)] font-bold text-3xl md:text-4xl tabular-nums">
        {count.toLocaleString()}{suffix}
      </p>
      <p className="text-white/60 text-sm mt-2">{label}</p>
    </div>
  );
}

export function NumbersSection() {
  return (
    <section className="bg-[var(--navy)] py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-serif text-3xl md:text-4xl text-white text-center mb-12">
          The Numbers
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">
          {NUMBERS.map((n) => (
            <AnimatedNumber key={n.label} {...n} />
          ))}
        </div>
      </div>
    </section>
  );
}
