'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  coverImage: string | null;
  tag: string | null;
  status: string;
  publishedAt: string | null;
  createdAt: string;
}

const fallbackArticles = [
  {
    tag: 'Personal Branding',
    title: 'Comment construire une marque personnelle forte sur LinkedIn en 2024',
    excerpt: 'Découvrez les 5 piliers fondamentaux pour bâtir une marque personnelle qui attire les bonnes opportunités et positionne votre expertise sur le marché.',
    date: '15 Juin 2024',
    slug: '',
  },
  {
    tag: 'Stratégie',
    title: "LinkedIn Algorithm : comprendre les dernières mises à jour pour plus de visibilité",
    excerpt: "Analyse approfondie des derniers changements de l'algorithme LinkedIn et les stratégies concrètes pour adapter votre approche de publication.",
    date: '2 Juin 2024',
    slug: '',
  },
  {
    tag: 'Prospection',
    title: 'Les erreurs fatales à éviter lors de votre prospection LinkedIn',
    excerpt: "Les techniques de prospection qui font fuir vos prospects et comment les remplacer par des approches authentiques qui génèrent des rendez-vous.",
    date: '20 Mai 2024',
    slug: '',
  },
  {
    tag: 'Content Marketing',
    title: 'Storytelling sur LinkedIn : raconter votre histoire pour inspirer et convaincre',
    excerpt: "Maîtrisez l'art du storytelling professionnel pour créer un lien émotionnel avec votre audience et transformer vos lecteurs en partenaires.",
    date: '8 Mai 2024',
    slug: '',
  },
];

export default function Articles() {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    fetch('/api/articles?status=published')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setArticles(data);
      })
      .catch(() => {});
  }, []);

  const displayArticles = articles.length > 0
    ? articles.slice(0, 4).map((a) => ({
        tag: a.tag || 'Article',
        title: a.title,
        excerpt: a.excerpt || a.content?.slice(0, 180) || '',
        date: new Date(a.publishedAt || a.createdAt).toLocaleDateString('fr-FR', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }),
        slug: a.slug,
      }))
    : fallbackArticles;

  return (
    <section id="articles" className="bg-paper">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-10 sm:mb-12 gap-4">
          <div>
            <span className="text-[12px] font-roboto font-medium text-brand-blue uppercase tracking-wider">
              Blog
            </span>
            <h2 className="font-oswald font-bold text-[28px] sm:text-[32px] text-pure-black mt-2 leading-[1.2]">
              Derniers articles
            </h2>
            <p className="text-[16px] font-roboto text-iron mt-3 max-w-[500px] leading-[1.5]">
              Réflexions, stratégies et conseils pratiques pour maîtriser LinkedIn
              et développer votre réseau professionnel.
            </p>
          </div>
          <Link
            href="/articles"
            className="inline-flex items-center gap-1 text-[14px] font-roboto font-medium text-brand-blue border border-brand-blue/30 px-5 py-2.5 rounded-[2px] hover:border-brand-blue transition-colors self-start sm:self-auto"
          >
            Voir tous les articles
            <ArrowUpRight size={16} />
          </Link>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {displayArticles.map((article) => (
            <Link
              key={article.title}
              href={article.slug ? `/articles/${article.slug}` : '/articles'}
              className="bg-card border border-mist rounded-[2px] p-4 hover:border-brand-blue/30 transition-colors group cursor-pointer flex flex-col"
            >
              {/* Image placeholder */}
              <div className="w-full h-[140px] bg-cloud rounded-[2px] mb-4 flex items-center justify-center overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-cloud to-mist opacity-60" />
              </div>

              <span className="text-[12px] font-roboto font-medium text-brand-blue uppercase tracking-wider">
                {article.tag}
              </span>
              <h3 className="font-oswald font-bold text-[16px] sm:text-[18px] text-pure-black mt-2 mb-2 leading-[1.3] line-clamp-3 group-hover:text-brand-blue transition-colors">
                {article.title}
              </h3>
              <p className="text-[14px] font-roboto text-iron leading-[1.5] line-clamp-3 mb-4 flex-1">
                {article.excerpt}
              </p>
              <p className="text-[12px] font-roboto text-steel">
                {article.date}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}