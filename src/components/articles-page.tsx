'use client';

import { useEffect, useState, useCallback } from 'react';
import { ArrowUpRight, Search, FileText } from 'lucide-react';

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  coverImage: string | null;
  tag: string | null;
  status: string;
  seoTitle: string | null;
  seoDescription: string | null;
  publishedAt: string | null;
  createdAt: string;
}

const allTags = ['Tous', 'Personal Branding', 'Stratégie', 'Prospection', 'Content Marketing', 'SEO'];

export default function ArticlesPage({ onArticleClick }: { onArticleClick: (slug: string) => void }) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTag, setActiveTag] = useState('Tous');

  const fetchArticles = useCallback(async () => {
    try {
      const res = await fetch('/api/articles?status=published');
      const data = await res.json();
      setArticles(Array.isArray(data) ? data : []);
    } catch {
      setArticles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const filtered = articles.filter((a) => {
    const matchSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.excerpt?.toLowerCase().includes(search.toLowerCase());
    const matchTag = activeTag === 'Tous' || a.tag === activeTag;
    return matchSearch && matchTag;
  });

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

  return (
    <section className="bg-cloud min-h-screen pt-16">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        {/* Page Header */}
        <div className="mb-10 sm:mb-12">
          <span className="text-[12px] font-roboto font-medium text-brand-blue uppercase tracking-wider">
            Blog
          </span>
          <h1 className="font-oswald font-bold text-[36px] sm:text-[44px] lg:text-[56px] text-pure-black mt-2 leading-[1.1]">
            Articles &{' '}
            <span className="bg-accent-wash-strong px-2">Ressources</span>
          </h1>
          <p className="text-[16px] font-roboto text-iron mt-4 max-w-[600px] leading-[1.5]">
            Stratégies, analyses et conseils pratiques pour maîtriser LinkedIn,
            développer votre personal branding et générer des opportunités business.
          </p>
        </div>

        {/* Search + Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-[400px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-steel" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un article..."
              className="w-full bg-white border border-mist rounded-[2px] pl-10 pr-4 py-2.5 text-[14px] font-roboto text-pure-black placeholder:text-steel focus:border-brand-blue focus:outline-none"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={`text-[12px] font-roboto font-medium px-3 py-1.5 rounded-[2px] border transition-colors ${
                  activeTag === tag
                    ? 'bg-pure-black text-white border-pure-black'
                    : 'bg-white text-iron border-mist hover:border-ash'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <p className="text-[12px] font-roboto text-steel mb-6">
          {filtered.length} article{filtered.length > 1 ? 's' : ''} trouvé{filtered.length > 1 ? 's' : ''}
        </p>

        {/* Articles Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-60 text-steel text-[14px]">
            Chargement des articles...
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-60 gap-3">
            <FileText size={40} className="text-ash" />
            <p className="text-iron text-[16px] font-roboto">Aucun article trouvé</p>
            <p className="text-steel text-[14px] font-roboto">
              {search ? 'Essayez un autre terme de recherche' : 'Revenez bientôt pour du nouveau contenu'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((article) => (
              <article
                key={article.id}
                onClick={() => onArticleClick(article.slug)}
                className="bg-white border border-mist rounded-[2px] overflow-hidden hover:border-brand-blue/30 transition-colors group cursor-pointer"
              >
                {/* Cover */}
                <div className="w-full h-[180px] bg-cloud flex items-center justify-center overflow-hidden relative">
                  {article.coverImage ? (
                    <img
                      src={article.coverImage}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-cloud via-mist/30 to-brand-blue/5" />
                  )}
                  {article.tag && (
                    <span className="absolute top-3 left-3 text-[11px] font-roboto font-medium text-brand-blue bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-[2px] border border-mist">
                      {article.tag}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <h2 className="font-oswald font-bold text-[18px] text-pure-black leading-[1.3] mb-2 line-clamp-2 group-hover:text-brand-blue transition-colors">
                    {article.title}
                  </h2>
                  <p className="text-[14px] font-roboto text-iron leading-[1.5] line-clamp-3 mb-4">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between pt-3 border-t border-mist">
                    <time className="text-[12px] font-roboto text-steel">
                      {formatDate(article.publishedAt || article.createdAt)}
                    </time>
                    <span className="inline-flex items-center gap-1 text-[12px] font-roboto font-medium text-brand-blue opacity-0 group-hover:opacity-100 transition-opacity">
                      Lire
                      <ArrowUpRight size={12} />
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}