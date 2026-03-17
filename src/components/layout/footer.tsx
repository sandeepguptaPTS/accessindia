import Link from "next/link";
import { Linkedin, Twitter, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[var(--navy)] text-white mt-auto print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company */}
          <div>
            <p className="text-base font-semibold text-[var(--gold)] mb-4" role="heading" aria-level={3}>Company</p>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm text-white/70 hover:text-[var(--gold)] transition-colors inline-block py-2">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-sm text-white/70 hover:text-[var(--gold)] transition-colors inline-block py-2">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/vision" className="text-sm text-white/70 hover:text-[var(--gold)] transition-colors inline-block py-2">
                  Vision & Values
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-white/70 hover:text-[var(--gold)] transition-colors inline-block py-2">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Tools */}
          <div>
            <p className="text-base font-semibold text-[var(--gold)] mb-4" role="heading" aria-level={3}>Tools</p>
            <ul className="space-y-2">
              <li>
                <Link href="/search" className="text-sm text-white/70 hover:text-[var(--gold)] transition-colors inline-block py-2">
                  Compliance Search (Beta)
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <p className="text-base font-semibold text-[var(--gold)] mb-4" role="heading" aria-level={3}>Disclaimer</p>
            <p className="text-sm text-white/50">
              Information provided is for guidance only and should not be
              considered legal or professional advice. Regulations change
              frequently. Always verify with official sources before making
              import decisions.
            </p>
          </div>

          {/* Contact */}
          <div>
            <p className="text-base font-semibold text-[var(--gold)] mb-4" role="heading" aria-level={3}>Contact</p>
            <div className="space-y-2 text-sm text-white/70">
              <p>9th & 12th Floor, Hemkunt House</p>
              <p>Rajendra Place, New Delhi 110008</p>
              <p>
                <a href="tel:+911141413939" className="hover:text-[var(--gold)] transition-colors inline-block py-1">
                  +91-11-41413939
                </a>
              </p>
              <p>
                <a href="mailto:help@accessindia.ai" className="hover:text-[var(--gold)] transition-colors inline-block py-1">
                  help@accessindia.ai
                </a>
              </p>
            </div>
            <div className="flex gap-1 mt-4">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/50 hover:text-[var(--gold)] transition-colors p-2"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/50 hover:text-[var(--gold)] transition-colors p-2"
                aria-label="X / Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/50 hover:text-[var(--gold)] transition-colors p-2"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-white/70 font-serif italic">
              Policy. Regulatory. Import Compliance. End to End.
            </p>
            <p className="text-xs text-white/40">
              &copy; 2026 Access India AI Private Limited. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
