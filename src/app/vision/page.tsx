import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vision & Values — Access India AI",
  description:
    "To build India's most trusted import compliance partner — where every answer is accurate, every certification is valid, and every shipment clears without surprises.",
};

const VALUES = [
  {
    title: "Compliance is non-negotiable.",
    description: "We will never cut corners to save time or money.",
  },
  {
    title: "We give hard advice.",
    description:
      "If your product cannot be imported legally, we will tell you on day one.",
  },
  {
    title: "Ethics over revenue.",
    description:
      "We will walk away from business before we compromise on what is right.",
  },
  {
    title: "We come from the bureaucracy and we respect it.",
    description:
      "There is no greater sacrifice for society than honest public service. Our work will always honour that institution.",
  },
  {
    title: "Government is not the adversary.",
    description:
      "We work within the system, not around it. Our policy work must create real value without hurting the interests of the Indian state.",
  },
  {
    title: "We build networks, not dependencies.",
    description:
      "Clients, customs agents, regulatory consultants — all on one platform, all with shared standards.",
  },
  {
    title: "Our people come first.",
    description:
      "Every partner and team member deserves a restful, healthy, and happy life.",
  },
];

const MESSAGES = [
  {
    to: "To Our Clients",
    text: "We are a new platform built by old hands — former customs officers and industry veterans who spent years inside the system you are trying to navigate. We are more concerned about your business\u2019s interests and liabilities than our own profits. If we take longer, it is because we are being thorough. We would rather delay a report than give you a wrong one. 100% compliant results. Every time.",
  },
  {
    to: "To Our Delivery Partners",
    text: "There will be times when you feel we can make a quick buck by choosing a shortcut. Please re-think. This is not the value statement you, we, or our children would want to live by. We chose the harder path on purpose. Stay on it with us. The earnings will grow — but only if the foundation is honest.",
  },
  {
    to: "To Our Team",
    text: "We may not have the best offices or the biggest budgets. But we will stand by you in every phase of life. More than profits, we care about your health, your happiness, and your peace of mind. Do good work. Go home on time. Sleep well. The rest will follow.",
  },
  {
    to: "To Every Government Officer Who Has Helped Us",
    text: "Thank you. In today\u2019s world, what you have done — listening to us, guiding us, giving us your time — is rarer than you think. The karma of honest public service gives back manifold. We have seen it. We believe in it. We will never misuse the trust you have placed in us.",
  },
];

export default function VisionPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-[var(--navy)] py-16 md:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-4xl md:text-5xl text-white">
            Vision &amp; Values
          </h1>
          <p className="mt-4 text-lg text-white/70">
            To build India&apos;s most trusted import compliance partner — where
            every answer is accurate, every certification is valid, and every
            shipment clears without surprises.
          </p>
        </div>
      </section>

      {/* Values — numbered manifesto style */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
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
                  <h3 className="font-semibold text-xl text-[var(--navy)] mb-1">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Messages */}
      <section className="py-16 md:py-20 bg-[var(--light-bg)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {MESSAGES.map((msg) => (
            <div key={msg.to}>
              <p className="text-sm font-semibold text-[var(--gold)] uppercase tracking-wider mb-3">
                {msg.to}
              </p>
              <blockquote className="font-serif text-lg md:text-xl text-[var(--navy)] leading-relaxed italic">
                &ldquo;{msg.text}&rdquo;
              </blockquote>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
