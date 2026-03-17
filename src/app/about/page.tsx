import type { Metadata } from "next";
import Link from "next/link";
import { Scale } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us — Access India AI Private Limited",
  description:
    "India's premier policy, regulatory, and import compliance consulting firm. Founded by former customs officers with 25+ years of regulatory leadership.",
};

const TEAM = [
  {
    name: "Tarun Goel",
    role: "Founder & Managing Director",
    initials: "TG",
    bio: "With over 25 years of experience in Indian regulatory systems, Tarun founded Omega QMS in 2000 and has since built one of India's most trusted compliance practices. His deep relationships across CBIC, DGFT, BIS, FSSAI, and other regulatory bodies give clients unparalleled access to India's governance ecosystem.",
  },
  {
    name: "Nitin Goyal",
    role: "Chief Operating Officer",
    initials: "NG",
    bio: "Nitin brings operational excellence to AccessIndia's compliance delivery. With expertise spanning customs procedures, certification management, and trade optimization, he ensures every client engagement is executed with precision.",
  },
];

const ARM_LEADERSHIP = [
  {
    name: "Adv. Arjun Raghavendra M",
    role: "Founding Partner",
    initials: "AR",
    focus: "Customs law, GST litigation, and international trade law. Deep expertise in trade remedy proceedings, anti-dumping investigations, and customs valuation disputes.",
  },
  {
    name: "Dr. Manjunath A N",
    role: "Partner",
    initials: "MA",
    focus: "Regulatory law, policy advocacy, and government liaison. Academic background in trade law combined with practical regulatory experience.",
  },
  {
    name: "Mr. Dhruva M. Seshadri",
    role: "Partner",
    initials: "DS",
    focus: "Tax litigation, customs appeals, and trade compliance advisory. Strong track record in customs tribunals and appellate forums.",
  },
];

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-[var(--navy)] py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-4xl md:text-5xl text-white">About Us</h1>
          <p className="mt-4 text-lg text-white/70 max-w-2xl">
            India&apos;s premier policy, regulatory, and import compliance consulting firm.
          </p>
        </div>
      </section>

      {/* Who We Are — narrative with key stats */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl text-[var(--navy)] mb-6">Who We Are</h2>
          <p className="text-gray-600 text-lg leading-relaxed mb-6">
            Access India AI Private Limited is a policy, regulatory, and import
            compliance consulting firm built on 25+ years of hands-on experience
            inside India&apos;s regulatory system. Our team includes former customs
            officers, trade policy professionals, and regulatory specialists who
            have worked within the very agencies that govern Indian imports.
          </p>
          <p className="text-gray-600 text-lg leading-relaxed mb-10">
            We help businesses — from Fortune 500 multinationals to growing
            importers — navigate the full spectrum of Indian import compliance:
            HS classification, customs duties, BIS/FSSAI/WPC certifications,
            DGFT licensing, FTA utilization, and customs litigation.
          </p>

          {/* Inline stats */}
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center p-6 bg-[var(--light-bg)] rounded-xl">
              <div className="text-3xl font-bold text-[var(--navy)]">25+</div>
              <div className="text-sm text-gray-500 mt-1">Years of Regulatory Leadership</div>
            </div>
            <div className="text-center p-6 bg-[var(--light-bg)] rounded-xl">
              <div className="text-3xl font-bold text-[var(--navy)]">10+</div>
              <div className="text-sm text-gray-500 mt-1">Government Agencies Covered</div>
            </div>
            <div className="text-center p-6 bg-[var(--light-bg)] rounded-xl">
              <div className="text-3xl font-bold text-[var(--navy)]">45+</div>
              <div className="text-sm text-gray-500 mt-1">Countries Served</div>
            </div>
          </div>
        </div>
      </section>

      {/* Why We Exist — full-width callout */}
      <section className="py-14 bg-[var(--navy)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-l-4 border-[var(--gold)] pl-6 md:pl-8">
            <h2 className="font-serif text-2xl md:text-3xl text-white mb-4">Why We Exist</h2>
            <p className="text-white/70 text-lg leading-relaxed">
              India&apos;s import compliance system is fragmented across 10+
              government agencies, hundreds of notifications, and constantly
              changing regulations. Most businesses either overpay duties, miss
              FTA savings, or face certification delays — simply because no single
              advisor covers the entire compliance chain.
            </p>
            <p className="mt-4 text-[var(--gold)] font-semibold text-lg">
              One firm, end-to-end, from the first customs notification to the last stamp on your Bill of Entry.
            </p>
          </div>
        </div>
      </section>

      {/* Omega QMS — Origin story */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="shrink-0">
              <div className="w-20 h-20 bg-[var(--navy)] rounded-2xl flex items-center justify-center">
                <span className="text-[var(--gold)] font-bold text-3xl">&#937;</span>
              </div>
            </div>
            <div>
              <h2 className="font-serif text-3xl text-[var(--navy)] mb-4">
                Omega QMS — Our Foundation
              </h2>
              <p className="text-gray-600 leading-relaxed mb-3">
                Founded in 2000, Omega QMS has been at the forefront of quality
                management and regulatory compliance for over 25 years. Operating
                across sectors including electronics, steel, food, pharma, and
                consumer goods, Omega has built deep institutional knowledge of
                India&apos;s standards and certification ecosystem.
              </p>
              <p className="text-gray-600 leading-relaxed">
                AccessIndia is the digital-first evolution of this expertise —
                combining Omega&apos;s 25 years of regulatory relationships with
                AI-powered compliance tools to serve a global client base.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-16 md:py-20 bg-[var(--light-bg)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl text-[var(--navy)] mb-10">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {TEAM.map((person) => (
              <div
                key={person.name}
                className="bg-white rounded-2xl p-8 border border-gray-100"
              >
                <div className="w-16 h-16 rounded-full bg-[var(--navy)] flex items-center justify-center mb-5">
                  <span className="text-[var(--gold)] font-bold text-xl">{person.initials}</span>
                </div>
                <h3 className="text-xl font-semibold text-[var(--navy)]">{person.name}</h3>
                <p className="text-sm text-[var(--gold)] font-medium mt-1 mb-4">{person.role}</p>
                <p className="text-sm text-gray-600 leading-relaxed">{person.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ARM Partnership */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start gap-4 mb-8">
            <div className="w-12 h-12 bg-[var(--deep-blue)] rounded-lg flex items-center justify-center shrink-0">
              <Scale className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-serif text-3xl text-[var(--navy)]">
                ARM Partnership
              </h2>
              <p className="text-gray-600 mt-2">
                Our legal partnership with the{" "}
                <a
                  href="https://lawchambersofarm.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--gold)] hover:underline"
                >
                  Law Chambers of ARM
                </a>{" "}
                brings specialized expertise in customs law, GST litigation, and trade remedies.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ARM_LEADERSHIP.map((person) => (
              <div key={person.name} className="p-6 rounded-xl bg-[var(--light-bg)]">
                <div className="w-10 h-10 rounded-full bg-[var(--deep-blue)] flex items-center justify-center mb-4">
                  <span className="text-white font-bold text-xs">{person.initials}</span>
                </div>
                <p className="font-semibold text-[var(--navy)]">{person.name}</p>
                <p className="text-xs text-[var(--gold)] font-medium mt-0.5 mb-3">{person.role}</p>
                <p className="text-sm text-gray-600 leading-relaxed">{person.focus}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Clients trust bar */}
      <section className="py-10 bg-[var(--light-bg)] border-y border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500 mb-5">
            Trusted by leading importers across electronics, steel, pharma, food, and consumer goods
          </p>
          <div className="flex justify-center items-center gap-12 flex-wrap">
            {["Bahru Steels", "PUMA", "Motorola"].map((name) => (
              <span key={name} className="text-lg font-semibold text-[var(--navy)]/40 tracking-wide">
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA — clean banner */}
      <section className="py-16 bg-[var(--navy)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl text-white mb-3">
            Let&apos;s Work Together
          </h2>
          <p className="text-white/60 mb-8 max-w-lg mx-auto">
            Whether you&apos;re navigating your first Indian import or optimizing an
            established supply chain, we&apos;re ready to help.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="px-8 py-3.5 bg-[var(--gold)] text-[var(--navy)] font-semibold rounded-lg hover:bg-[var(--gold-hover)] transition-colors"
            >
              Schedule a Consultation
            </Link>
            <Link
              href="/services"
              className="px-8 py-3.5 border border-white/30 text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
            >
              View Our Services
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
