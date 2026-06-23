'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, FileText } from 'lucide-react';

const navLinks = [
  { label: 'Accueil', href: '/', activeOn: '/' },
  { label: 'Services', href: '/#services' },
  { label: 'Articles', href: '/articles', activeOn: '/articles' },
  { label: 'Témoignages', href: '/#temoignages' },
  { label: 'Contact', href: '/contact', activeOn: '/contact' },
];

export default function Navbar({
  onOpenAdmin,
  currentPage,
}: {
  onOpenAdmin: () => void;
  currentPage?: string;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (link: (typeof navLinks)[number]) => {
    if (link.activeOn) {
      return pathname === link.activeOn || pathname.startsWith(link.activeOn + '/');
    }
    return false;
  };

  const isHome = currentPage === 'home' || !currentPage || pathname === '/';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-mist">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <div className="w-8 h-8 bg-brand-blue rounded-[2px] flex items-center justify-center">
            <span className="text-white font-oswald font-bold text-sm leading-none">MN</span>
          </div>
          <span className="font-oswald font-bold text-[20px] text-pure-black tracking-tight hidden sm:inline">
            maurice nontondji
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-[29px]">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-[14px] font-roboto font-medium transition-colors ${
                isActive(link) ? 'text-pure-black' : 'text-graphite hover:text-pure-black'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={onOpenAdmin}
            className="w-8 h-8 flex items-center justify-center text-steel hover:text-brand-blue border border-mist rounded-[2px] hover:border-brand-blue/30 transition-colors cursor-pointer"
            title="Gestion des articles"
          >
            <FileText size={15} />
          </button>
          <Link
            href="/contact"
            className="text-[14px] font-roboto font-medium text-white bg-brand-blue px-5 py-2.5 rounded-[2px] hover:bg-brand-blue/90 transition-colors"
          >
            Me contacter
          </Link>
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
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`text-[14px] font-roboto font-medium py-2 transition-colors ${
                  isActive(link) ? 'text-pure-black' : 'text-graphite hover:text-pure-black'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={() => { setMobileOpen(false); onOpenAdmin(); }}
              className="text-[14px] font-roboto font-medium text-steel border border-mist px-5 py-2.5 rounded-[2px] text-center cursor-pointer"
            >
              Gestion des articles
            </button>
            <Link
              href="/contact"
              onClick={() => setMobileOpen(false)}
              className="text-[14px] font-roboto font-medium text-white bg-brand-blue px-5 py-2.5 rounded-[2px] text-center"
            >
              Me contacter
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}