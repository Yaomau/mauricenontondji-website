import {
  UserCheck,
  PenTool,
  BarChart3,
  Target,
  MessageSquare,
  CalendarCheck,
} from 'lucide-react';

const services = [
  {
    icon: UserCheck,
    title: 'Optimisation de profil',
    description:
      'Refonte complète de votre profil LinkedIn : headline percutante, résumé stratégique, section expérience valorisée. Votre profil devient un véritable outil de conversion qui capte l\'attention des décideurs et reflète votre expertise.',
  },
  {
    icon: PenTool,
    title: 'Stratégie de contenu',
    description:
      'Création d\'un calendrier éditorial sur mesure avec des posts engageants, des articles de réflexion et du storytelling. Chaque publication est conçue pour positionner votre expertise et générer des interactions qualitatives.',
  },
  {
    icon: BarChart3,
    title: 'Analyse & Reporting',
    description:
      'Suivi détaillé de vos performances avec des tableaux de bord personnalisés. Analyse des KPIs clés, optimisation continue et rapports stratégiques pour mesurer le ROI de votre présence sur LinkedIn.',
  },
  {
    icon: Target,
    title: 'Prospection LinkedIn',
    description:
      'Mise en place de campagnes de prospection ciblées pour identifier et engager vos prospects idéaux. Scripts personnalisés, séquences de relance et qualification des leads pour maximiser votre taux de conversion.',
  },
  {
    icon: MessageSquare,
    title: 'Community Management',
    description:
      'Gestion professionnelle de votre réseau LinkedIn : engagement authentique, réponse aux commentaires, participation stratégique aux discussions et développement de votre communauté de professionnels engagés.',
  },
  {
    icon: CalendarCheck,
    title: 'Accompagnement personnalisé',
    description:
      'Sessions de coaching individuelles pour développer votre posture éditoriale et votre aisance sur le réseau. Un suivi rapproché avec des recommandations sur mesure adaptées à vos objectifs business.',
  },
];

export default function Services() {
  return (
    <section id="services" className="bg-obsidian">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
        {/* Section Header */}
        <div className="mb-12 sm:mb-16">
          <span className="text-[12px] font-roboto font-medium text-fog uppercase tracking-wider">
            Services
          </span>
          <h2 className="font-oswald font-bold text-[28px] sm:text-[32px] lg:text-[36px] text-white mt-2 leading-[1.2]">
            Mes{' '}
            <span className="bg-accent-wash-strong px-2 text-white">services</span>
          </h2>
          <p className="text-[16px] font-roboto text-fog mt-4 max-w-[600px] leading-[1.5]">
            Un accompagnement complet pour transformer votre présence LinkedIn
            en véritable levier de croissance business.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.title}
              className="border border-white/10 rounded-[2px] p-6 hover:border-brand-blue/40 transition-colors group"
            >
              <div className="w-10 h-10 flex items-center justify-center mb-4 bg-brand-blue/15 text-brand-blue-light rounded-[2px]">
                <service.icon size={22} strokeWidth={1.5} />
              </div>
              <h3 className="font-oswald font-bold text-[20px] text-white mb-3 leading-[1.3]">
                {service.title}
              </h3>
              <p className="text-[14px] font-roboto text-fog leading-[1.5]">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}