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

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 md:pt-28 md:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — text */}
          <div>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white leading-[1.1] tracking-tight">
              Policy. Regulatory.
              <br />
              <span className="text-[var(--gold)]">Import Compliance.</span>
              <br />
              End to End.
            </h1>
            <p className="mt-8 text-lg text-white/80 leading-relaxed">
              From Government policy interface to product certification to customs
              clearance — we handle the entire compliance chain so your goods move
              and your business is protected.
            </p>
            <p className="mt-4 text-sm text-white/50">
              Former customs officers. Senior government officials. Industry
              veterans. 25 years of institutional relationships. We work within
              the system because we helped build it.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/services"
                className="px-7 py-3.5 bg-[var(--gold)] text-[var(--navy)] font-semibold rounded-lg hover:bg-[var(--gold-hover)] transition-colors"
              >
                Explore Our Services
              </Link>
              <Link
                href="/contact"
                className="px-7 py-3.5 border border-white/30 text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
              >
                Schedule a Consultation
              </Link>
            </div>
          </div>

          {/* Right — compliance flow diagram */}
          <div className="hidden lg:flex justify-center">
            <div className="relative w-[380px] h-[380px]">
              {/* Outer ring */}
              <div className="absolute inset-0 rounded-full border border-white/[0.08]" />
              {/* Middle ring */}
              <div className="absolute inset-8 rounded-full border border-[var(--gold)]/20" />
              {/* Inner ring */}
              <div className="absolute inset-16 rounded-full border border-white/[0.06]" />

              {/* Center */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-[var(--gold)] font-bold text-5xl font-serif">264</p>
                  <p className="text-white/40 text-[11px] mt-1.5 uppercase tracking-[0.15em]">Compliance checks</p>
                  <div className="w-8 h-px bg-[var(--gold)]/30 mx-auto mt-2.5 mb-2.5" />
                  <p className="text-white/40 text-[11px] uppercase tracking-[0.15em]">19 Sources</p>
                </div>
              </div>

              {/* Agency nodes positioned around the circle */}
              {[
                { label: "CBIC", top: "2%", left: "50%", tx: "-50%" },
                { label: "DGFT", top: "15%", left: "88%", tx: "-50%" },
                { label: "BIS", top: "42%", left: "97%", tx: "-50%" },
                { label: "FSSAI", top: "70%", left: "88%", tx: "-50%" },
                { label: "WPC", top: "88%", left: "65%", tx: "-50%" },
                { label: "MoEF", top: "88%", left: "35%", tx: "-50%" },
                { label: "CDSCO", top: "70%", left: "12%", tx: "-50%" },
                { label: "PQ", top: "42%", left: "3%", tx: "-50%" },
                { label: "DPIIT", top: "15%", left: "12%", tx: "-50%" },
              ].map((node) => (
                <div
                  key={node.label}
                  className="absolute"
                  style={{
                    top: node.top,
                    left: node.left,
                    transform: `translate(${node.tx}, -50%)`,
                  }}
                >
                  <div className="w-[52px] h-[52px] rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center backdrop-blur-sm">
                    <span className="text-[11px] font-semibold text-white/70 tracking-wide">
                      {node.label}
                    </span>
                  </div>
                </div>
              ))}

              {/* Connecting lines from center to nodes (subtle) */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 380 380" fill="none">
                {[
                  [190, 190, 190, 22],
                  [190, 190, 340, 72],
                  [190, 190, 370, 175],
                  [190, 190, 340, 280],
                  [190, 190, 250, 345],
                  [190, 190, 130, 345],
                  [190, 190, 45, 280],
                  [190, 190, 15, 175],
                  [190, 190, 45, 72],
                ].map(([x1, y1, x2, y2], i) => (
                  <line
                    key={i}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="rgba(212, 168, 67, 0.08)"
                    strokeWidth="1"
                  />
                ))}
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
