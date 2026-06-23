import { Linkedin, Mail, ArrowUpRight } from 'lucide-react';

const footerLinks = {
  navigation: {
    title: 'Navigation',
    links: [
      { label: 'Accueil', href: '#accueil' },
      { label: 'Services', href: '#services' },
      { label: 'Articles', href: '#articles' },
      { label: 'Témoignages', href: '#temoignages' },
      { label: 'Contact', href: '#contact' },
    ],
  },
  services: {
    title: 'Services',
    links: [
      { label: 'Optimisation de profil', href: '#services' },
      { label: 'Stratégie de contenu', href: '#services' },
      { label: 'Analyse & Reporting', href: '#services' },
      { label: 'Prospection LinkedIn', href: '#services' },
      { label: 'Coaching personnalisé', href: '#services' },
    ],
  },
  ressources: {
    title: 'Ressources',
    links: [
      { label: 'Blog', href: '#articles' },
      { label: 'Guide gratuit LinkedIn', href: '#' },
      { label: 'Templates de posts', href: '#' },
      { label: 'Étude de cas', href: '#' },
      { label: 'FAQ', href: '#' },
    ],
  },
};

export default function Footer() {
  return (
    <footer className="bg-obsidian border-t border-white/5">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand Column */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-brand-blue rounded-[2px] flex items-center justify-center">
                <span className="text-white font-oswald font-bold text-sm leading-none">
                  MN
                </span>
              </div>
              <span className="font-oswald font-bold text-[16px] text-white">
                maurice nontondji
              </span>
            </div>
            <p className="text-[14px] font-roboto text-fog leading-[1.5] mb-4 max-w-[240px]">
              Expert LinkedIn & Stratégie Digitale. J&apos;aide les entrepreneurs à
              transformer leur visibilité en opportunités business.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="w-8 h-8 border border-white/10 rounded-[2px] flex items-center justify-center text-fog hover:text-brand-blue-light hover:border-brand-blue/40 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={16} />
              </a>
              <a
                href="#"
                className="w-8 h-8 border border-white/10 rounded-[2px] flex items-center justify-center text-fog hover:text-brand-blue-light hover:border-brand-blue/40 transition-colors"
                aria-label="Email"
              >
                <Mail size={16} />
              </a>
            </div>
          </div>

          {/* Link Columns */}
          {Object.values(footerLinks).map((col) => (
            <div key={col.title}>
              <h4 className="text-[14px] font-roboto font-bold text-white mb-4">
                {col.title}
              </h4>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-[14px] font-roboto text-fog hover:text-brand-blue-light transition-colors inline-flex items-center gap-1"
                    >
                      {link.label}
                      {link.href === '#' && <ArrowUpRight size={12} />}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[12px] font-roboto text-steel">
            &copy; {new Date().getFullYear()} Maurice Nontondji. Tous droits réservés.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-[12px] font-roboto text-steel hover:text-fog transition-colors">
              Mentions légales
            </a>
            <a href="#" className="text-[12px] font-roboto text-steel hover:text-fog transition-colors">
              Politique de confidentialité
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}