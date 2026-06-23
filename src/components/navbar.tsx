'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Menu, X, Sun, Moon } from 'lucide-react';

const navLinks = [
  { label: 'Accueil', href: '/', activeOn: '/', hash: '' },
  { label: 'Services', href: '/#services', activeOn: undefined, hash: '#services' },
  { label: 'Articles', href: '/articles', activeOn: '/articles', hash: '' },
  { label: 'Témoignages', href: '/#temoignages', activeOn: undefined, hash: '#temoignages' },
  { label: 'Contact', href: '/contact', activeOn: '/contact', hash: '' },
];

export default function Navbar({
  currentPage,
}: {
  currentPage?: string;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useState(() => {
    setMounted(true);
  });

  const isActive = (link: (typeof navLinks)[number]) => {
    if (link.activeOn) {
      return pathname === link.activeOn || pathname.startsWith(link.activeOn + '/');
    }
    return false;
  };

  const scrollToHash = useCallback((hash: string) => {
    if (!hash) return;
    const id = hash.replace('#', '');
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const handleNav = useCallback(
    (e: React.MouseEvent, link: (typeof navLinks)[number]) => {
      e.preventDefault();
      setMobileOpen(false);

      const isHome = pathname === '/';

      if (link.hash && isHome) {
        scrollToHash(link.hash);
        window.history.replaceState(null, '', link.hash);
        return;
      }

      if (link.hash && !isHome) {
        router.push('/');
        const checkAndScroll = () => {
          const id = link.hash!.replace('#', '');
          const el = document.getElementById(id);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
            window.history.replaceState(null, '', link.hash);
          } else {
            setTimeout(checkAndScroll, 100);
          }
        };
        setTimeout(checkAndScroll, 150);
        return;
      }

      router.push(link.href);
    },
    [pathname, router, scrollToHash],
  );

  const handleContactCta = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setMobileOpen(false);
      if (pathname !== '/contact') {
        router.push('/contact');
      }
    },
    [pathname, router],
  );

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const navBg = 'bg-white dark:bg-obsidian';
  const borderCls = 'border-mist dark:border-iron/30';
  const textPrimary = 'text-pure-black dark:text-cloud';
  const textSecondary = 'text-graphite dark:text-ash hover:text-pure-black dark:hover:text-white';
  const textActive = 'text-pure-black dark:text-white';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 ${navBg} border-b ${borderCls}`}>
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <div className="w-8 h-8 bg-brand-blue rounded-[2px] flex items-center justify-center">
            <span className="text-white font-oswald font-bold text-sm leading-none">MN</span>
          </div>
          <span className={`font-oswald font-bold text-[20px] tracking-tight hidden sm:inline ${textPrimary}`}>
            maurice nontondji
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-[29px]">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNav(e, link)}
              className={`text-[14px] font-roboto font-medium transition-colors cursor-pointer ${
                isActive(link) ? textActive : textSecondary
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-3">
          {/* Theme Toggle */}
          {mounted && (
            <button
              onClick={toggleTheme}
              className={`w-8 h-8 flex items-center justify-center border ${borderCls} rounded-[2px] transition-colors cursor-pointer ${
                theme === 'dark' ? 'text-brand-yellow hover:text-brand-yellow/80 border-iron/30' : 'text-steel hover:text-brand-blue'
              }`}
              title={theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
            >
              {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            </button>
          )}

          <a
            href="/contact"
            onClick={handleContactCta}
            className="text-[14px] font-roboto font-medium text-white bg-brand-blue px-5 py-2.5 rounded-[2px] hover:bg-brand-blue/90 transition-colors cursor-pointer"
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
        <div className={`md:hidden ${navBg} border-t ${borderCls}`}>
          <div className="px-4 py-4 flex flex-col gap-3">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNav(e, link)}
                className={`text-[14px] font-roboto font-medium py-2 transition-colors cursor-pointer ${
                  isActive(link) ? textActive : textSecondary
                }`}
              >
                {link.label}
              </a>
            ))}
            <div className="flex items-center gap-3 pt-2 border-t border-mist dark:border-iron/30">
              {/* Mobile Theme Toggle */}
              {mounted && (
                <button
                  onClick={toggleTheme}
                  className={`flex-1 text-[14px] font-roboto font-medium ${textSecondary} border ${borderCls} px-4 py-2.5 rounded-[2px] text-center cursor-pointer flex items-center justify-center gap-2`}
                >
                  {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
                  {theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
                </button>
              )}
            </div>
            <a
              href="/contact"
              onClick={handleContactCta}
              className="text-[14px] font-roboto font-medium text-white bg-brand-blue px-5 py-2.5 rounded-[2px] text-center cursor-pointer"
            >
              Me contacter
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}