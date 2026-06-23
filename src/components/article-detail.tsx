'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft, Calendar, Clock, Tag } from 'lucide-react';

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  coverImage: string | null;
  tag: string | null;
  status: string;
  focusKeyword: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

function useArticle(slug: string) {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/articles')
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        if (Array.isArray(data)) {
          const found = data.find((a: Article) => a.slug === slug);
          setArticle(found || null);
        }
      })
      .catch(() => { if (!cancelled) setArticle(null); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [slug]);

  return { article, loading };
}

export default function ArticleDetail({
  slug,
  onBack,
}: {
  slug: string;
  onBack: () => void;
}) {
  const { article, loading } = useArticle(slug);

  if (loading) {
    return (
      <div className="bg-cloud min-h-screen pt-16">
        <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="animate-pulse">
            <div className="h-4 w-20 bg-mist rounded-[2px] mb-4" />
            <div className="h-10 w-3/4 bg-mist rounded-[2px] mb-6" />
            <div className="h-4 w-full bg-mist rounded-[2px] mb-2" />
            <div className="h-4 w-5/6 bg-mist rounded-[2px] mb-2" />
            <div className="h-4 w-2/3 bg-mist rounded-[2px]" />
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="bg-cloud min-h-screen pt-16">
        <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <p className="text-[20px] font-oswald font-bold text-iron mb-4">
            Article introuvable
          </p>
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-[14px] font-roboto font-medium text-brand-blue hover:text-brand-blue/80 transition-colors"
          >
            <ArrowLeft size={16} />
            Retour aux articles
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

  const readingTime = article.content
    ? Math.max(1, Math.ceil(article.content.split(/\s+/).filter(Boolean).length / 250))
    : 1;

  return (
    <div className="bg-cloud min-h-screen pt-16">
      {/* Top bar */}
      <div className="bg-white border-b border-mist">
        <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-4">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-[13px] font-roboto font-medium text-iron hover:text-pure-black transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} />
            Articles
          </button>
        </div>
      </div>

      <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* Tag */}
        {article.tag && (
          <div className="flex items-center gap-2 mb-4">
            <Tag size={12} className="text-brand-blue" />
            <span className="text-[12px] font-roboto font-medium text-brand-blue uppercase tracking-wider">
              {article.tag}
            </span>
          </div>
        )}

        {/* Title */}
        <h1 className="font-oswald font-bold text-[32px] sm:text-[40px] lg:text-[48px] text-pure-black leading-[1.15] mb-6">
          {article.title}
        </h1>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4 text-[13px] font-roboto text-steel mb-8 pb-8 border-b border-mist">
          <span className="inline-flex items-center gap-1.5">
            <Calendar size={14} />
            {formatDate(article.publishedAt || article.createdAt)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock size={14} />
            {readingTime} min de lecture
          </span>
          {article.focusKeyword && (
            <span className="inline-flex items-center gap-1.5 text-ash">
              Mot-clé : {article.focusKeyword}
            </span>
          )}
        </div>

        {/* Cover Image */}
        {article.coverImage && (
          <div className="w-full h-[280px] sm:h-[380px] rounded-[2px] overflow-hidden mb-8 bg-cloud">
            <img
              src={article.coverImage}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Excerpt */}
        {article.excerpt && (
          <p className="text-[18px] sm:text-[20px] font-roboto font-medium text-graphite leading-[1.6] mb-8 pb-8 border-b border-mist">
            {article.excerpt}
          </p>
        )}

        {/* Content */}
        <div>
          {article.content?.split('\n').map((paragraph, i) => {
            const trimmed = paragraph.trim();
            if (!trimmed) return <br key={i} />;
            if (trimmed.startsWith('### '))
              return (
                <h3 key={i} className="font-oswald font-bold text-[22px] text-pure-black mt-8 mb-3 leading-[1.3]">
                  {trimmed.slice(4)}
                </h3>
              );
            if (trimmed.startsWith('## '))
              return (
                <h2 key={i} className="font-oswald font-bold text-[26px] text-pure-black mt-10 mb-4 leading-[1.2]">
                  {trimmed.slice(3)}
                </h2>
              );
            if (trimmed.startsWith('# '))
              return (
                <h1 key={i} className="font-oswald font-bold text-[32px] text-pure-black mt-10 mb-4 leading-[1.2]">
                  {trimmed.slice(2)}
                </h1>
              );
            if (trimmed.startsWith('- ') || trimmed.startsWith('* '))
              return (
                <div key={i} className="flex gap-3 mb-2 ml-2">
                  <span className="w-1.5 h-1.5 bg-brand-blue rounded-full mt-2 shrink-0" />
                  <p className="text-[16px] font-roboto text-graphite leading-[1.7] flex-1">
                    {trimmed.slice(2)}
                  </p>
                </div>
              );
            if (/^\d+\.\s/.test(trimmed)) {
              const num = trimmed.match(/^(\d+)\.\s/)?.[1];
              return (
                <div key={i} className="flex gap-3 mb-2 ml-2">
                  <span className="text-[14px] font-oswald font-bold text-brand-blue shrink-0 mt-0.5">
                    {num}.
                  </span>
                  <p className="text-[16px] font-roboto text-graphite leading-[1.7] flex-1">
                    {trimmed.replace(/^\d+\.\s/, '')}
                  </p>
                </div>
              );
            }
            const parts = trimmed.split(/(\*\*[^*]+\*\*)/g);
            return (
              <p key={i} className="text-[16px] font-roboto text-graphite leading-[1.8] mb-4">
                {parts.map((part, j) => {
                  if (part.startsWith('**') && part.endsWith('**'))
                    return <strong key={j} className="font-bold text-pure-black">{part.slice(2, -2)}</strong>;
                  return part;
                })}
              </p>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 pt-8 border-t border-mist">
          <div className="bg-obsidian rounded-[2px] p-6 sm:p-8 text-center">
            <h3 className="font-oswald font-bold text-[22px] text-white mb-2">
              Envie de booster votre visibilité LinkedIn ?
            </h3>
            <p className="text-[14px] font-roboto text-fog mb-5 max-w-[460px] mx-auto leading-[1.5]">
              Réservez un appel découverte gratuit pour discuter de votre stratégie.
            </p>
            <a
              href="#contact"
              onClick={(e) => { e.preventDefault(); onBack(); }}
              className="inline-flex items-center gap-2 bg-brand-blue text-white text-[14px] font-roboto font-medium px-6 py-3 rounded-[2px] hover:bg-brand-blue/90 transition-colors"
            >
              Réserver un appel découverte
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}