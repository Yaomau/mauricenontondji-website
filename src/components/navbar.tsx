'use client';

import { useState } from 'react';
import { Menu, X, FileText } from 'lucide-react';

interface PageView {
  view: string;
  slug?: string;
}

const navLinks = [
  { label: 'Accueil', href: '#accueil', page: { view: 'home' } as PageView },
  { label: 'Services', href: '#services', page: { view: 'home' } as PageView },
  { label: 'Articles', href: '#articles', page: { view: 'articles' } as PageView },
  { label: 'Témoignages', href: '#temoignages', page: { view: 'home' } as PageView },
  { label: 'Contact', href: '#contact', page: { view: 'home' } as PageView },
];

export default function Navbar({
  onOpenAdmin,
  currentPage,
  onNavigate,
}: {
  onOpenAdmin: () => void;
  currentPage?: string;
  onNavigate?: (page: PageView) => void;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNav = (page: PageView, href: string) => {
    if (onNavigate && page.view === 'articles') {
      onNavigate(page);
    } else if (onNavigate && !isHome) {
      // Navigate back to home first, then scroll to section
      onNavigate({ view: 'home' });
      setTimeout(() => {
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } else {
      // Already on home — scroll to section
      const el = document.querySelector(href);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setMobileOpen(false);
  };

  const isHome = currentPage === 'home' || !currentPage;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-mist">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => {
            if (onNavigate && !isHome) {
              onNavigate({ view: 'home' });
            } else {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          className="flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <div className="w-8 h-8 bg-brand-blue rounded-[2px] flex items-center justify-center">
            <span className="text-white font-oswald font-bold text-sm leading-none">MN</span>
          </div>
          <span className="font-oswald font-bold text-[20px] text-pure-black tracking-tight hidden sm:inline">
            maurice nontondji
          </span>
        </button>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-[29px]">
          {navLinks.map((link) => {
            const isActive =
              (link.page.view === 'articles' && currentPage === 'articles') ||
              (link.page.view === 'articles' && currentPage === 'article') ||
              (link.page.view === 'home' && isHome);
            return (
              <button
                key={link.href}
                onClick={() => handleNav(link.page, link.href)}
                className={`text-[14px] font-roboto font-medium transition-colors cursor-pointer ${
                  isActive ? 'text-pure-black' : 'text-graphite hover:text-pure-black'
                }`}
              >
                {link.label}
              </button>
            );
          })}
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
          <a
            href={isHome ? '#contact' : '#'}
            onClick={(e) => {
              if (!isHome) {
                e.preventDefault();
                onNavigate?.({ view: 'home' });
                setTimeout(() => {
                  document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }
            }}
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
              <button
                key={link.href}
                onClick={() => handleNav(link.page, link.href)}
                className="text-[14px] font-roboto font-medium text-graphite hover:text-pure-black py-2 transition-colors text-left cursor-pointer"
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => { setMobileOpen(false); onOpenAdmin(); }}
              className="text-[14px] font-roboto font-medium text-steel border border-mist px-5 py-2.5 rounded-[2px] text-center cursor-pointer"
            >
              Gestion des articles
            </button>
            <a
              href={isHome ? '#contact' : '#'}
              onClick={(e) => {
                setMobileOpen(false);
                if (!isHome) {
                  e.preventDefault();
                  onNavigate?.({ view: 'home' });
                  setTimeout(() => {
                    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }
              }}
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