import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vision & Values — Access India AI Private Limited",
  description:
    "Our vision for transparent, predictable Indian import compliance. Built on integrity, expertise, and service.",
};

const VALUES = [
  {
    title: "Integrity First",
    description: "100% compliance, no shortcuts, no grey areas. We protect your business by doing things right.",
  },
  {
    title: "Transparency",
    description: "Clear communication, honest assessments, no hidden fees. You always know where you stand.",
  },
  {
    title: "Deep Expertise",
    description: "We come from the system. Our knowledge isn't theoretical — it's built from decades inside Indian regulatory agencies.",
  },
  {
    title: "Client Partnership",
    description: "We succeed when you succeed. Every engagement is a partnership, not a transaction.",
  },
  {
    title: "Accessibility",
    description: "Regulatory compliance shouldn't be a privilege. We make India's import system navigable for businesses of all sizes.",
  },
  {
    title: "Accountability",
    description: "We stand behind our advice. Every recommendation is backed by current law and official notifications.",
  },
  {
    title: "Service Excellence",
    description: "End-to-end means end-to-end. We don't hand off half-done work or leave clients stranded mid-process.",
  },
];

const MESSAGES = [
  {
    to: "To Our Clients",
    text: "You trusted us with your business — the most valuable thing you have. We take that trust seriously. Every classification, every certification, every duty calculation carries your name and ours. We will never compromise on accuracy to save time, or on compliance to save cost. Your success in India is our only measure of success.",
  },
  {
    to: "To Our Delivery Partners",
    text: "You are the backbone of our service. Every customs broker, every certification lab, every logistics partner in our network represents AccessIndia to our clients. We choose partners who share our values: precision, reliability, and absolute integrity. Together, we make Indian imports work.",
  },
  {
    to: "To Our Team",
    text: "You are the reason our clients trust us. Your expertise, your dedication, your willingness to dig into the details — that's what makes AccessIndia different. We invest in your growth because your knowledge is our greatest asset. Stay curious, stay rigorous, stay kind.",
  },
  {
    to: "To Every Government Officer Who Has Helped Us",
    text: "India's regulatory system works because of dedicated public servants who take their responsibilities seriously. We have been fortunate to learn from, and work alongside, officers who embody the best of Indian governance. Your guidance has shaped everything we do. Thank you.",
  },
];

export default function VisionPage() {
  return (
    <div>
      {/* Vision Statement */}
      <section className="bg-[var(--navy)] py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white leading-tight">
            Making Indian import compliance{" "}
            <span className="text-[var(--gold)]">transparent, predictable,</span>{" "}
            and accessible.
          </h1>
          <p className="mt-8 text-lg text-white/60 max-w-2xl mx-auto">
            We envision a world where importing into India is as straightforward
            as importing into any developed market — with clear rules, fair
            enforcement, and expert guidance available to every business.
          </p>
        </div>
      </section>

      {/* Values — numbered manifesto style */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl md:text-4xl text-[var(--navy)] mb-12">
            Our Values
          </h2>
          <ol className="space-y-8">
            {VALUES.map((value, i) => (
              <li key={value.title} className="flex items-start gap-5">
                <span className="text-[var(--gold)] font-serif text-3xl font-bold leading-none mt-0.5 shrink-0 w-8">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-semibold text-xl text-[var(--navy)] mb-1">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Messages */}
      <section className="py-16 md:py-20 bg-[var(--light-bg)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {MESSAGES.map((msg) => (
            <div key={msg.to}>
              <p className="text-sm font-semibold text-[var(--gold)] uppercase tracking-wider mb-3">
                {msg.to}
              </p>
              <blockquote className="font-serif text-lg md:text-xl text-[var(--navy)] leading-relaxed">
                &ldquo;{msg.text}&rdquo;
              </blockquote>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
