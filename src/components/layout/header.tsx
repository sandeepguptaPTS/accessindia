"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const NAV_LINKS = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/vision", label: "Vision & Values" },
  { href: "/contact", label: "Contact" },
  { href: "/search", label: "Search", badge: "Beta" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-[var(--navy)] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-white">
              Access<span className="text-[var(--gold)]">India</span>
              <span className="text-white/50 text-sm">.ai</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-white/80 hover:text-[var(--gold)] transition-colors flex items-center gap-1.5"
              >
                {link.href === "/search" && <Search className="w-3.5 h-3.5" />}
                {link.label}
                {link.badge && (
                  <Badge className="bg-[var(--gold)] text-[var(--navy)] text-[10px] px-1.5 py-0 hover:bg-[var(--gold)]">
                    {link.badge}
                  </Badge>
                )}
              </Link>
            ))}
            <Link
              href="/contact"
              className="ml-2 px-4 py-2 bg-[var(--gold)] text-[var(--navy)] text-sm font-semibold rounded-lg hover:bg-[#c49a3a] transition-colors"
            >
              Get a Quote
            </Link>
          </nav>

          {/* Mobile hamburger button */}
          <button
            className="lg:hidden p-2 text-white/80 hover:text-[var(--gold)] transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <nav className="lg:hidden bg-[var(--navy)] border-t border-white/10">
          <div className="px-4 py-3 space-y-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-white/80 hover:text-[var(--gold)] hover:bg-white/5 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.href === "/search" && <Search className="w-3.5 h-3.5" />}
                {link.label}
                {link.badge && (
                  <Badge className="bg-[var(--gold)] text-[var(--navy)] text-[10px] px-1.5 py-0 hover:bg-[var(--gold)]">
                    {link.badge}
                  </Badge>
                )}
              </Link>
            ))}
            <div className="pt-2">
              <Link
                href="/contact"
                className="block text-center px-4 py-2.5 bg-[var(--gold)] text-[var(--navy)] text-sm font-semibold rounded-lg hover:bg-[#c49a3a] transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Get a Quote
              </Link>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
