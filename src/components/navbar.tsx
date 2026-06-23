'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useTheme } from 'next-themes';
import { Menu, X, FileText, Sun, Moon, LogIn, LogOut, Lock } from 'lucide-react';

const navLinks = [
  { label: 'Accueil', href: '/', activeOn: '/', hash: '' },
  { label: 'Services', href: '/#services', activeOn: undefined, hash: '#services' },
  { label: 'Articles', href: '/articles', activeOn: '/articles', hash: '' },
  { label: 'Témoignages', href: '/#temoignages', activeOn: undefined, hash: '#temoignages' },
  { label: 'Contact', href: '/contact', activeOn: '/contact', hash: '' },
];

export default function Navbar({
  onOpenAdmin,
  currentPage,
}: {
  onOpenAdmin: () => void;
  currentPage?: string;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    try {
      const result = await signIn('credentials', {
        email: loginEmail,
        password: loginPassword,
        redirect: false,
      });

      if (result?.error) {
        setLoginError('Email ou mot de passe incorrect');
      } else {
        setShowLogin(false);
        setLoginEmail('');
        setLoginPassword('');
        setMobileOpen(false);
      }
    } catch {
      setLoginError('Erreur de connexion');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleAdminClick = () => {
    setMobileOpen(false);
    if (session) {
      onOpenAdmin();
    } else {
      setShowLogin(true);
    }
  };

  const handleSignOut = async () => {
    setMobileOpen(false);
    await signOut({ callbackUrl: '/' });
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const navBg = 'bg-white dark:bg-obsidian';
  const borderCls = 'border-mist dark:border-iron/30';
  const textPrimary = 'text-pure-black dark:text-cloud';
  const textSecondary = 'text-graphite dark:text-ash hover:text-pure-black dark:hover:text-white';
  const textActive = 'text-pure-black dark:text-white';

  return (
    <>
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

            {/* Admin Button */}
            <button
              onClick={handleAdminClick}
              className={`w-8 h-8 flex items-center justify-center border ${borderCls} rounded-[2px] transition-colors cursor-pointer ${
                session
                  ? 'text-brand-blue border-brand-blue/30'
                  : 'text-steel hover:text-brand-blue'
              }`}
              title="Gestion des articles"
            >
              <FileText size={15} />
            </button>

            {/* Login/Logout */}
            {session ? (
              <button
                onClick={handleSignOut}
                className={`w-8 h-8 flex items-center justify-center border ${borderCls} rounded-[2px] transition-colors cursor-pointer text-steel hover:text-destructive`}
                title="Déconnexion"
              >
                <LogOut size={15} />
              </button>
            ) : (
              <button
                onClick={() => setShowLogin(true)}
                className={`w-8 h-8 flex items-center justify-center border ${borderCls} rounded-[2px] transition-colors cursor-pointer text-steel hover:text-brand-blue`}
                title="Connexion admin"
              >
                <LogIn size={15} />
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
                {/* Mobile Admin */}
                <button
                  onClick={handleAdminClick}
                  className={`flex-1 text-[14px] font-roboto font-medium border ${borderCls} px-4 py-2.5 rounded-[2px] text-center cursor-pointer ${
                    session ? 'text-brand-blue border-brand-blue/30' : 'text-steel'
                  }`}
                >
                  Admin
                </button>
                {/* Mobile Login/Logout */}
                {session ? (
                  <button
                    onClick={handleSignOut}
                    className="flex-1 text-[14px] font-roboto font-medium text-steel border border-mist dark:border-iron/30 px-4 py-2.5 rounded-[2px] text-center cursor-pointer hover:text-destructive"
                  >
                    Déconnexion
                  </button>
                ) : (
                  <button
                    onClick={() => { setMobileOpen(false); setShowLogin(true); }}
                    className="flex-1 text-[14px] font-roboto font-medium text-steel border border-mist dark:border-iron/30 px-4 py-2.5 rounded-[2px] text-center cursor-pointer"
                  >
                    Connexion
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

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-obsidian rounded-[2px] shadow-sm-2 w-full max-w-md mx-4 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-blue/10 dark:bg-brand-blue/20 rounded-[2px] flex items-center justify-center">
                  <Lock size={20} className="text-brand-blue" />
                </div>
                <div>
                  <h2 className="font-oswald font-bold text-lg text-pure-black dark:text-white">Connexion Admin</h2>
                  <p className="text-[13px] text-steel dark:text-fog">Accès réservé à l'administrateur</p>
                </div>
              </div>
              <button
                onClick={() => { setShowLogin(false); setLoginError(''); }}
                className="w-8 h-8 flex items-center justify-center text-steel hover:text-pure-black dark:hover:text-white transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-[13px] font-roboto font-medium text-graphite dark:text-ash mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="admin@mauricenontondji.com"
                  required
                  className="w-full h-10 px-3 text-[14px] font-roboto bg-paper dark:bg-graphite/50 border border-mist dark:border-iron/30 rounded-[2px] text-pure-black dark:text-white placeholder:text-steel dark:placeholder:text-iron focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue transition-colors"
                />
              </div>
              <div>
                <label className="block text-[13px] font-roboto font-medium text-graphite dark:text-ash mb-1.5">
                  Mot de passe
                </label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full h-10 px-3 text-[14px] font-roboto bg-paper dark:bg-graphite/50 border border-mist dark:border-iron/30 rounded-[2px] text-pure-black dark:text-white placeholder:text-steel dark:placeholder:text-iron focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue transition-colors"
                />
              </div>

              {loginError && (
                <p className="text-[13px] text-destructive font-roboto">{loginError}</p>
              )}

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full h-10 bg-brand-blue text-white text-[14px] font-roboto font-medium rounded-[2px] hover:bg-brand-blue/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {loginLoading ? 'Connexion...' : 'Se connecter'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}