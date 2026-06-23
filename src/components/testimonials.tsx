import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Aminata Diallo',
    role: 'Fondatrice, Afrika Consulting Group',
    text: "Maurice a complètement transformé ma présence LinkedIn. En trois mois, j'ai multiplié mes impressions par 4 et surtout, j'ai généré 12 rendez-vous qualifiés qui ont abouti à 3 contrats. Son approche est stratégique, méthodique et toujours adaptée à mon secteur d'activité.",
    initials: 'AD',
  },
  {
    name: 'Koffi Yao',
    role: 'CEO, TechVision Africa',
    text: "Je recommande Maurice sans hésitation. Sa compréhension de l'algorithme LinkedIn et sa capacité à créer du contenu engageant sont remarquables. Mon profil est passé de 800 à 5 000 abonnés en 6 mois avec un taux d'engagement bien au-dessus de la moyenne.",
    initials: 'KY',
  },
  {
    name: 'Fatoumata Bamba',
    role: 'Directrice Marketing, InnoLab',
    text: "Travailler avec Maurice a été un déclic pour notre stratégie de marque employeur sur LinkedIn. Il a su comprendre nos valeurs et les traduire en publications qui résonnent vraiment avec notre cible. Le ROI est là, clairement.",
    initials: 'FB',
  },
  {
    name: 'Patrick Okou',
    role: 'Entrepreneur serial, Série A Ventures',
    text: "Ce qui distingue Maurice, c'est son approche data-driven. Chaque recommandation est appuyée par des métriques et chaque stratégie est mesurable. C'est rare dans le domaine du conseil LinkedIn et ça fait toute la différence.",
    initials: 'PO',
  },
  {
    name: 'Mariam Touré',
    role: 'Consultante en Leadership, ExecutiveCoach Africa',
    text: "Maurice m'a aidée à structurer ma pensée et à la traduire en contenu percutant. Sa méthode de storytelling est puissante. Aujourd'hui, je reçois régulièrement des sollicitations de médias et d'événements grâce à ma visibilité LinkedIn.",
    initials: 'MT',
  },
  {
    name: 'Emmanuel Asante',
    role: 'COO, Digital Bridge Consulting',
    text: "L'accompagnement de Maurice dépasse largement le simple conseil LinkedIn. Il a une vision globale du personal branding et de la stratégie digitale. Notre équipe commerciale utilise désormais les méthodes qu'il nous a enseignées.",
    initials: 'EA',
  },
];

function StarRating() {
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star key={i} size={14} className="text-pure-black fill-pure-black" />
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section id="temoignages" className="bg-cloud">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <span className="text-[12px] font-roboto font-medium text-badge-slate uppercase tracking-wider">
            Témoignages
          </span>
          <h2 className="font-oswald font-bold text-[28px] sm:text-[32px] lg:text-[36px] text-pure-black mt-2 leading-[1.2]">
            Ce que disent{' '}
            <span className="bg-accent-wash-strong px-2">mes clients</span>
          </h2>
          <p className="text-[16px] font-roboto text-iron mt-4 max-w-[550px] mx-auto leading-[1.5]">
            Des entrepreneurs et dirigeants qui ont transformé leur présence
            LinkedIn grâce à un accompagnement sur mesure.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="bg-white border border-mist rounded-[2px] p-6 flex flex-col"
            >
              {/* Quote icon + Rating */}
              <div className="flex items-start justify-between mb-4">
                <Quote size={20} className="text-mist" />
                <StarRating />
              </div>

              {/* Text */}
              <p className="text-[14px] font-roboto text-iron leading-[1.6] flex-1">
                &ldquo;{testimonial.text}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 mt-6 pt-4 border-t border-mist">
                <div className="w-10 h-10 bg-cloud border border-mist rounded-[2px] flex items-center justify-center shrink-0">
                  <span className="text-[12px] font-oswald font-bold text-graphite">
                    {testimonial.initials}
                  </span>
                </div>
                <div>
                  <p className="text-[14px] font-roboto font-medium text-pure-black">
                    {testimonial.name}
                  </p>
                  <p className="text-[12px] font-roboto text-steel">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}