'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';
import SiteShell from '@/components/site-shell';

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
  seoTitle: string | null;
  seoDescription: string | null;
}

export default function ArticleDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch('/api/articles?status=published')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const found = data.find((a: Article) => a.slug === slug);
          if (found) {
            setArticle(found);
          } else {
            setNotFound(true);
          }
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  return (
    <SiteShell currentPage="article">
      <article className="pt-16 bg-cloud min-h-screen">
        <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-8">
            <Link
              href="/articles"
              className="inline-flex items-center gap-1 text-[14px] font-roboto text-steel hover:text-brand-blue transition-colors"
            >
              <ArrowLeft size={14} />
              Tous les articles
            </Link>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="w-6 h-6 border-2 border-mist border-t-brand-blue rounded-full animate-spin" />
            </div>
          )}

          {notFound && (
            <div className="text-center py-20">
              <h1 className="font-oswald font-bold text-[32px] text-pure-black mb-4">
                Article introuvable
              </h1>
              <p className="text-[16px] font-roboto text-iron mb-8">
                L&apos;article que vous cherchez n&apos;existe pas ou a été supprimé.
              </p>
              <Link
                href="/articles"
                className="inline-flex items-center gap-2 bg-brand-blue text-white text-[14px] font-roboto font-medium px-5 py-2.5 rounded-[2px] hover:bg-brand-blue/90 transition-colors"
              >
                <ArrowLeft size={16} />
                Voir tous les articles
              </Link>
            </div>
          )}

          {article && (
            <>
              {/* Article Header */}
              <header className="mb-8">
                {article.tag && (
                  <span className="inline-flex items-center gap-1 text-[12px] font-roboto font-medium text-brand-blue uppercase tracking-wider mb-4">
                    <Tag size={12} />
                    {article.tag}
                  </span>
                )}
                <h1 className="font-oswald font-bold text-[32px] sm:text-[40px] text-pure-black leading-[1.15]">
                  {article.title}
                </h1>
                {article.publishedAt && (
                  <div className="flex items-center gap-2 mt-4 text-[14px] font-roboto text-steel">
                    <Calendar size={14} />
                    <time>
                      {new Date(article.publishedAt).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </time>
                  </div>
                )}
              </header>

              {/* Cover image placeholder */}
              <div className="w-full h-[300px] sm:h-[400px] bg-cloud rounded-[2px] mb-8 border border-mist overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-cloud to-mist opacity-60" />
              </div>

              {/* Excerpt */}
              {article.excerpt && (
                <p className="text-[18px] font-roboto text-iron leading-[1.6] mb-8 border-l-2 border-brand-blue pl-4">
                  {article.excerpt}
                </p>
              )}

              {/* Content */}
              <div className="prose-article">
                {article.content ? (
                  <div
                    className="text-[16px] font-roboto text-graphite leading-[1.75] space-y-4"
                    dangerouslySetInnerHTML={{ __html: article.content }}
                  />
                ) : (
                  <p className="text-[16px] font-roboto text-iron">
                    Le contenu de cet article sera bientôt disponible.
                  </p>
                )}
              </div>

              {/* Bottom CTA */}
              <div className="mt-12 pt-8 border-t border-mist">
                <div className="bg-obsidian rounded-[2px] p-6 sm:p-8 text-center">
                  <h3 className="font-oswald font-bold text-[20px] text-white mb-2">
                    Besoin d&apos;un accompagnement LinkedIn sur mesure ?
                  </h3>
                  <p className="text-[14px] font-roboto text-fog mb-6">
                    Réservez un appel découverte pour discuter de votre stratégie.
                  </p>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 bg-brand-blue text-white text-[14px] font-roboto font-medium px-5 py-2.5 rounded-[2px] hover:bg-brand-blue/90 transition-colors"
                  >
                    Me contacter
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </article>
    </SiteShell>
  );
}