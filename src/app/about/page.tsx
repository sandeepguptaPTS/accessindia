import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us — Access India AI Private Limited",
  description:
    "A professional advisory portal for foreign individuals and companies who want to import goods into India or explore business and investment opportunities.",
};

const TEAM = [
  {
    name: "Tarun Goel",
    role: "Founder & Managing Director, Omega QMS Private Limited",
    initials: "TG",
    bio: "Tarun founded Omega QMS in 2000 and has spent over 25 years advising global brands, Indian conglomerates, and industry bodies, including numerous Fortune 500 companies on regulatory compliance, trade policy, and market access in India. He is widely respected for his counsel on technical regulations and Quality Control Orders (QCOs), with direct engagement across key Indian authorities including BIS, DPIIT, MeitY, DGFT, and the Ministry of Commerce & Industry.",
  },
  {
    name: "Nitin Goyal",
    role: "COO, Omega QMS Private Limited",
    initials: "NG",
    bio: "Nitin brings an entrepreneurial background in steel manufacturing and retail to his role as COO at Omega QMS, one of India\u2019s most trusted names in regulatory compliance and market access for over 25 years. He leads execution across cross-border trade, FDI facilitation, policy advocacy, and technical regulations including QCOs, helping global manufacturers and investors navigate India\u2019s regulatory landscape with clarity and confidence.",
  },
];

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-[var(--navy)] py-16 md:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-4xl md:text-5xl text-white">About Us</h1>
        </div>
      </section>

      {/* Section 1: Who We Are */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl text-[var(--navy)] mb-6">Who We Are</h2>
          <p className="text-gray-600 text-lg leading-relaxed italic">
            We are a new platform built by old hands — former customs officers
            and industry veterans who spent years inside the system you are
            trying to navigate. We are more concerned about your business&apos;s
            interests and liabilities than our own profits. If we take longer, it
            is because we are being thorough. We would rather delay a report than
            give you a wrong one. 100% compliant results. Every time.
          </p>
        </div>
      </section>

      {/* Section 2: Why We Exist */}
      <section className="py-16 md:py-20 bg-[var(--light-bg)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl text-[var(--navy)] mb-6">Why We Exist</h2>
          <p className="text-gray-600 text-lg leading-relaxed italic">
            India&apos;s import compliance system is powerful but deeply
            fragmented. BIS, FSSAI, WPC, CDSCO, DGFT, MoEF, Customs — each with
            their own notifications, timelines, and processes. A single missed
            certification can result in shipment detention, demurrage and
            re-export at the importer&apos;s cost. Most companies discover this
            after the container arrives. We exist so they discover it before they
            ship.
          </p>
        </div>
      </section>

      {/* Section 3: Our Clients (was Section 4 in doc) */}
      <section className="py-12 bg-white border-y border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl text-[var(--navy)] mb-6 text-center">Our Clients</h2>
          <div className="flex justify-center items-center gap-12 flex-wrap">
            {["Bahru Steels", "PUMA", "Motorola"].map((name) => (
              <span key={name} className="text-lg font-semibold text-[var(--navy)]/50 tracking-wide">
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: Omega QMS — Our Foundation (was Section 5 in doc) */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl text-[var(--navy)] mb-6">
            Omega QMS — Our Foundation
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed italic">
            AccessIndia.ai has been developed under the aegis of Omega QMS
            Private Limited — a leading Indian consulting firm founded in 2000,
            specialising in global trade, regulatory compliance, policy advocacy,
            foreign investment facilitation, and corporate advisory. For 25
            years, Omega QMS has advised multinational corporations, global
            manufacturers, investors, and industry bodies across electronics,
            steel, aluminium, polymers, textiles, electrical appliances,
            automotive components, tyres, footwear, furniture, bearings, and
            engineering products. Our work spans Central Government policy
            interface, product certifications across all Partner Government
            Agencies, customs and trade optimisation. Client portfolio includes
            Fortune 500 companies.
          </p>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-16 md:py-20 bg-[var(--light-bg)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl text-[var(--navy)] mb-10">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {TEAM.map((person) => (
              <div
                key={person.name}
                className="p-8 rounded-2xl bg-white"
              >
                <div className="w-14 h-14 rounded-full bg-[var(--navy)] flex items-center justify-center mb-5">
                  <span className="text-[var(--gold)] font-bold text-lg">{person.initials}</span>
                </div>
                <h3 className="text-xl font-semibold text-[var(--navy)]">{person.name}</h3>
                <p className="text-sm text-[var(--gold)] font-medium mt-1 mb-4">{person.role}</p>
                <p className="text-sm text-gray-600 leading-relaxed">{person.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl text-[var(--navy)] mb-3">
            Let&apos;s Work Together
          </h2>
          <p className="text-gray-600 mb-8 max-w-lg mx-auto">
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
              className="px-8 py-3.5 border border-[var(--navy)]/30 text-[var(--navy)] font-semibold rounded-lg hover:bg-[var(--navy)]/5 transition-colors"
            >
              View Our Services
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
