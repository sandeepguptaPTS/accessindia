import Link from "next/link";

export function CtaBanner() {
  return (
    <section className="bg-[var(--gold)] py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-serif text-2xl md:text-3xl text-[var(--navy)] max-w-2xl mx-auto">
          Importing into India? Have a big or small policy issue?{" "}
          <span className="font-bold">Let&apos;s talk.</span>
        </h2>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/contact"
            className="px-6 py-3 bg-[var(--navy)] text-white font-semibold rounded-lg hover:bg-[var(--deep-blue)] transition-colors"
          >
            Get in Touch
          </Link>
          <Link
            href="/services"
            className="px-6 py-3 bg-white text-[var(--navy)] font-semibold rounded-lg hover:bg-gray-50 transition-colors"
          >
            View Our Services
          </Link>
        </div>
      </div>
    </section>
  );
}
