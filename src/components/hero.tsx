import Link from 'next/link';
import { ArrowRight, TrendingUp, Users, Eye } from 'lucide-react';

export default function Hero() {
  return (
    <section
      id="accueil"
      className="pt-16 bg-cloud"
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — Headline + CTA */}
          <div className="flex flex-col gap-6">
            <span className="inline-block text-[12px] font-roboto font-medium text-brand-blue uppercase tracking-wider">
              Expert LinkedIn & Personal Branding
            </span>
            <h1 className="font-oswald font-bold text-[36px] sm:text-[44px] lg:text-[56px] leading-[1.1] text-pure-black">
              Transformez votre{' '}
              <span className="bg-accent-wash-strong px-2">visibilité</span>{' '}
              sur LinkedIn en opportunités business
            </h1>
            <p className="text-[16px] font-roboto text-iron leading-[1.5] max-w-[520px]">
              Consultant en stratégie LinkedIn, j&apos;accompagne les entrepreneurs
              et dirigeants afrophones dans la construction d&apos;une marque
              personnelle forte et crédible pour générer des leads qualifiés et
              des partenariats durables.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-2">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-brand-blue text-white text-[16px] font-roboto font-medium px-6 py-3 rounded-[2px] shadow-sm hover:bg-brand-blue/90 transition-colors"
              >
                Réserver un appel découverte
                <ArrowRight size={18} strokeWidth={2} />
              </Link>
              <a
                href="#services"
                className="inline-flex items-center justify-center text-[14px] font-roboto font-medium text-obsidian border border-brand-blue/30 bg-accent-yellow-solid px-5 py-3 rounded-[2px] hover:border-brand-blue/50 transition-colors"
              >
                Découvrir mes services
              </a>
            </div>
          </div>

          {/* Right — Metrics Widget */}
          <div className="bg-card border border-mist rounded-[2px] shadow-sm-2 p-4 sm:p-6">
            {/* Widget Header */}
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-mist">
              <div>
                <p className="text-[12px] font-roboto font-medium text-badge-slate uppercase">
                  Performance LinkedIn
                </p>
                <p className="text-[14px] font-roboto text-steel mt-1">
                  Profil optimisé — 6 derniers mois
                </p>
              </div>
              <div className="flex items-center gap-1 text-[12px] font-roboto font-medium text-green-600">
                <TrendingUp size={14} />
                +127%
              </div>
            </div>

            {/* Chart Area */}
            <div className="relative h-[180px] sm:h-[200px] mb-4">
              <svg
                className="w-full h-full"
                viewBox="0 0 400 180"
                preserveAspectRatio="none"
              >
                {/* Grid lines */}
                <line x1="0" y1="45" x2="400" y2="45" className="stroke-mist" strokeWidth="1" />
                <line x1="0" y1="90" x2="400" y2="90" className="stroke-mist" strokeWidth="1" />
                <line x1="0" y1="135" x2="400" y2="135" className="stroke-mist" strokeWidth="1" />

                {/* Area fill */}
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0176cc" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#0176cc" stopOpacity="0.02" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,160 L40,150 L80,140 L120,120 L160,110 L200,85 L240,70 L280,55 L320,40 L360,30 L400,15 L400,180 L0,180 Z"
                  fill="url(#areaGrad)"
                />

                {/* Line */}
                <path
                  d="M0,160 L40,150 L80,140 L120,120 L160,110 L200,85 L240,70 L280,55 L320,40 L360,30 L400,15"
                  fill="none"
                  stroke="#0176cc"
                  strokeWidth="2"
                />

                {/* Data points */}
                <circle cx="0" cy="160" r="3" fill="#0176cc" />
                <circle cx="80" cy="140" r="3" fill="#0176cc" />
                <circle cx="160" cy="110" r="3" fill="#0176cc" />
                <circle cx="240" cy="70" r="3" fill="#0176cc" />
                <circle cx="320" cy="40" r="3" fill="#0176cc" />
                <circle cx="400" cy="15" r="4" fill="#0176cc" />
              </svg>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-mist">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Eye size={14} className="text-steel" />
                </div>
                <p className="text-[20px] font-oswald font-bold text-pure-black">48.2K</p>
                <p className="text-[12px] font-roboto text-steel">Impressions/mois</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Users size={14} className="text-steel" />
                </div>
                <p className="text-[20px] font-oswald font-bold text-pure-black">3.8K</p>
                <p className="text-[12px] font-roboto text-steel">Abonnés</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <TrendingUp size={14} className="text-steel" />
                </div>
                <p className="text-[20px] font-oswald font-bold text-pure-black">12.4%</p>
                <p className="text-[12px] font-roboto text-steel">Taux d&apos;engagement</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}