'use client';

import { useState } from 'react';
import { Menu, X, FileText } from 'lucide-react';

const navLinks = [
  { label: 'Accueil', href: '#accueil' },
  { label: 'Services', href: '#services' },
  { label: 'Articles', href: '#articles' },
  { label: 'Témoignages', href: '#temoignages' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar({ onOpenAdmin }: { onOpenAdmin: () => void }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-mist">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#accueil" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 bg-brand-blue rounded-[2px] flex items-center justify-center">
            <span className="text-white font-oswald font-bold text-sm leading-none">MN</span>
          </div>
          <span className="font-oswald font-bold text-[20px] text-pure-black tracking-tight hidden sm:inline">
            maurice nontondji
          </span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-[29px]">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[14px] font-roboto font-medium text-graphite hover:text-pure-black transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={onOpenAdmin}
            className="w-8 h-8 flex items-center justify-center text-steel hover:text-brand-blue border border-mist rounded-[2px] hover:border-brand-blue/30 transition-colors"
            title="Gestion des articles"
          >
            <FileText size={15} />
          </button>
          <a
            href="#contact"
            className="text-[14px] font-roboto font-medium text-white bg-brand-blue px-5 py-2.5 rounded-[2px] hover:bg-brand-blue/90 transition-colors"
          >
            Me contacter
          </a>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-brand-blue hover:text-brand-blue/70 transition-colors"
          aria-label="Menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-mist">
          <div className="px-4 py-4 flex flex-col gap-3">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-[14px] font-roboto font-medium text-graphite hover:text-pure-black py-2 transition-colors"
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={() => { setMobileOpen(false); onOpenAdmin(); }}
              className="text-[14px] font-roboto font-medium text-steel border border-mist px-5 py-2.5 rounded-[2px] text-center mt-2"
            >
              Gestion des articles
            </button>
            <a
              href="#contact"
              onClick={() => setMobileOpen(false)}
              className="text-[14px] font-roboto font-medium text-white bg-brand-blue px-5 py-2.5 rounded-[2px] text-center"
            >
              Me contacter
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}