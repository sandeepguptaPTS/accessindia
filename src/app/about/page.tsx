import type { Metadata } from "next";
import Link from "next/link";
import { Mail, Phone, Linkedin, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

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
    bio: "With over 25 years of experience in Indian regulatory systems, Tarun founded Omega QMS in 2000 and has since built one of India's most trusted compliance practices. His deep relationships across CBIC, DGFT, BIS, FSSAI, and other regulatory bodies give clients unparalleled access to India's governance ecosystem. Tarun's vision is to make Indian import compliance transparent, predictable, and accessible to businesses worldwide.",
  },
  {
    name: "Nitin Goyal",
    role: "Chief Operating Officer",
    initials: "NG",
    bio: "Nitin brings operational excellence to AccessIndia's compliance delivery. With expertise spanning customs procedures, certification management, and trade optimization, he ensures every client engagement is executed with precision. Nitin oversees the firm's day-to-day operations, client delivery, and the development of AccessIndia's technology-enabled compliance tools.",
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
      <section className="bg-[var(--navy)] py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-4xl md:text-5xl text-white">About Us</h1>
          <p className="mt-4 text-lg text-white/70 max-w-2xl">
            India&apos;s premier policy, regulatory, and import compliance consulting firm.
          </p>
        </div>
      </section>

      {/* Who We Are + Why We Exist — side by side */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl text-[var(--navy)] mb-6">Who We Are</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-600">
            <p>
              Access India AI Private Limited is a policy, regulatory, and import
              compliance consulting firm built on 25+ years of hands-on experience
              inside India&apos;s regulatory system. Our team includes former customs
              officers, trade policy professionals, and regulatory specialists who
              have worked within the very agencies that govern Indian imports.
            </p>
            <p>
              We help businesses — from Fortune 500 multinationals to growing
              importers — navigate the full spectrum of Indian import compliance:
              HS classification, customs duties, BIS/FSSAI/WPC certifications,
              DGFT licensing, FTA utilization, and customs litigation.
            </p>
          </div>
        </div>
      </section>

      {/* Why We Exist — bold pull-quote style */}
      <section className="py-12 bg-[var(--light-bg)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-l-4 border-[var(--gold)] pl-6">
            <h2 className="font-serif text-2xl text-[var(--navy)] mb-3">Why We Exist</h2>
            <p className="text-gray-600">
              India&apos;s import compliance system is fragmented across 10+
              government agencies, hundreds of notifications, and constantly
              changing regulations. Most businesses either overpay duties, miss
              FTA savings, or face certification delays — simply because no single
              advisor covers the entire compliance chain.
            </p>
            <p className="mt-3 text-[var(--navy)] font-semibold">
              One firm, end-to-end, from the first customs notification to the last stamp on your Bill of Entry.
            </p>
          </div>
        </div>
      </section>

      {/* Our Clients */}
      <section className="py-12 bg-white border-y border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-2xl text-[var(--navy)] mb-4">Our Clients</h2>
          <p className="text-gray-500 text-sm mb-6">
            Trusted by leading importers across electronics, steel, pharma, food, and consumer goods.
          </p>
          <div className="flex justify-center gap-8 flex-wrap">
            {["Bahru Steels", "PUMA", "Motorola"].map((name) => (
              <span key={name} className="text-lg font-semibold text-[var(--navy)]/50">
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Omega QMS */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl text-[var(--navy)] mb-6">
            Omega QMS — Our Foundation
          </h2>
          <Card className="border-[var(--gold)]/30">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-[var(--navy)] rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-[var(--gold)] font-bold text-xl">&#937;</span>
                </div>
                <div className="space-y-3 text-gray-600">
                  <p>
                    Founded in 2000, Omega QMS has been at the forefront of quality
                    management and regulatory compliance for over 25 years. Operating
                    across sectors including electronics, steel, food, pharma, and
                    consumer goods, Omega has built deep institutional knowledge of
                    India&apos;s standards and certification ecosystem.
                  </p>
                  <p>
                    AccessIndia is the digital-first evolution of this expertise —
                    combining Omega&apos;s 25 years of regulatory relationships with
                    AI-powered compliance tools to serve a global client base.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Team — editorial staggered layout */}
      <section className="py-16 bg-[var(--light-bg)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl text-[var(--navy)] mb-10">Our Team</h2>
          <div className="space-y-12">
            {TEAM.map((person, i) => (
              <div
                key={person.name}
                className={`flex flex-col md:flex-row gap-6 ${
                  i % 2 === 1 ? "md:flex-row-reverse" : ""
                }`}
              >
                <div className="shrink-0 flex flex-col items-center md:items-start">
                  <div className="w-20 h-20 rounded-full bg-[var(--navy)] flex items-center justify-center">
                    <span className="text-[var(--gold)] font-bold text-2xl">{person.initials}</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[var(--navy)]">{person.name}</h3>
                  <p className="text-sm text-[var(--gold)] font-medium mb-3">{person.role}</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{person.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ARM Partnership — single narrative block with inline team */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl text-[var(--navy)] mb-3">
            ARM Partnership
          </h2>
          <p className="text-gray-600 mb-8">
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

          <div className="space-y-6">
            {ARM_LEADERSHIP.map((person) => (
              <div key={person.name} className="flex items-start gap-4 border-l-4 border-[var(--deep-blue)] pl-5">
                <div className="w-12 h-12 rounded-full bg-[var(--deep-blue)] flex items-center justify-center shrink-0">
                  <span className="text-white font-bold text-sm">{person.initials}</span>
                </div>
                <div>
                  <p className="font-semibold text-[var(--navy)]">{person.name}</p>
                  <p className="text-xs text-[var(--gold)] mb-1">{person.role}</p>
                  <p className="text-sm text-gray-600">{person.focus}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact & Trust Signals */}
      <section className="py-16 bg-[var(--navy)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl text-white mb-8">Get in Touch</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-start gap-3 text-white/70">
                <MapPin className="w-5 h-5 text-[var(--gold)] mt-0.5" />
                <div>
                  <p>9th & 12th Floor, Hemkunt House</p>
                  <p>Rajendra Place, New Delhi 110008</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-white/70">
                <Phone className="w-5 h-5 text-[var(--gold)]" />
                <a href="tel:+911141413939" className="hover:text-[var(--gold)] transition-colors">
                  +91-11-41413939
                </a>
              </div>
              <div className="flex items-center gap-3 text-white/70">
                <Phone className="w-5 h-5 text-[var(--gold)]" />
                <a href="tel:+919810541740" className="hover:text-[var(--gold)] transition-colors">
                  +91-9810541740
                </a>
              </div>
              <div className="flex items-center gap-3 text-white/70">
                <Mail className="w-5 h-5 text-[var(--gold)]" />
                <a href="mailto:help@accessindia.ai" className="hover:text-[var(--gold)] transition-colors">
                  help@accessindia.ai
                </a>
              </div>
              <div className="flex items-center gap-3 text-white/70">
                <Linkedin className="w-5 h-5 text-[var(--gold)]" />
                <span>LinkedIn</span>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <Link
                href="/contact"
                className="px-8 py-4 bg-[var(--gold)] text-[var(--navy)] font-semibold rounded-lg hover:bg-[#c49a3a] transition-colors text-lg"
              >
                Schedule a Consultation
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
