'use client';

import { useState, useEffect, useCallback } from 'react';
import Navbar from '@/components/navbar';
import Hero from '@/components/hero';
import Services from '@/components/services';
import Trust from '@/components/trust';
import HomeArticles from '@/components/articles';
import Testimonials from '@/components/testimonials';
import CTA from '@/components/cta';
import Footer from '@/components/footer';
import ArticleAdmin from '@/components/article-admin';
import ArticlesPage from '@/components/articles-page';
import ArticleDetail from '@/components/article-detail';

type Page =
  | { view: 'home' }
  | { view: 'articles' }
  | { view: 'article'; slug: string };

function parseHash(hash: string): Page {
  if (hash.startsWith('#article/')) {
    const slug = hash.slice('#article/'.length);
    return slug ? { view: 'article', slug } : { view: 'articles' };
  }
  if (hash === '#articles') return { view: 'articles' };
  return { view: 'home' };
}

export default function Home() {
  const [adminOpen, setAdminOpen] = useState(false);
  const [page, setPage] = useState<Page>({ view: 'home' });
  const [prevPage, setPrevPage] = useState<Page>({ view: 'home' });

  // Sync hash → state
  useEffect(() => {
    const onHash = () => setPage(parseHash(window.location.hash));
    window.addEventListener('hashchange', onHash);
    onHash();
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const navigate = useCallback((p: Page) => {
    setPrevPage(page);
    setPage(p);
    if (p.view === 'articles') window.location.hash = '#articles';
    else if (p.view === 'article') window.location.hash = `#article/${p.slug}`;
    else window.location.hash = '';
    window.scrollTo({ top: 0 });
  }, [page]);

  const goBack = useCallback(() => {
    navigate(prevPage.view === 'article' ? { view: 'articles' } : { view: 'home' });
  }, [navigate, prevPage]);

  // Render pages
  if (page.view === 'articles') {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar onOpenAdmin={() => setAdminOpen(true)} currentPage="articles" onNavigate={navigate} />
        <main className="flex-1">
          <ArticlesPage onArticleClick={(slug) => navigate({ view: 'article', slug })} />
        </main>
        <Footer />
        {adminOpen && <ArticleAdmin onClose={() => setAdminOpen(false)} />}
      </div>
    );
  }

  if (page.view === 'article') {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar onOpenAdmin={() => setAdminOpen(true)} currentPage="article" onNavigate={navigate} />
        <main className="flex-1">
          <ArticleDetail slug={page.slug} onBack={goBack} />
        </main>
        <Footer />
        {adminOpen && <ArticleAdmin onClose={() => setAdminOpen(false)} />}
      </div>
    );
  }

  // Home
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onOpenAdmin={() => setAdminOpen(true)} currentPage="home" onNavigate={navigate} />
      <main className="flex-1">
        <Hero />
        <Services />
        <Trust />
        <HomeArticles onNavigateArticles={() => navigate({ view: 'articles' })} />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
      {adminOpen && <ArticleAdmin onClose={() => setAdminOpen(false)} />}
    </div>
  );
}