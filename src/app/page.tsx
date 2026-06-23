'use client';

import { useState } from 'react';
import Navbar from '@/components/navbar';
import Hero from '@/components/hero';
import Services from '@/components/services';
import Trust from '@/components/trust';
import Articles from '@/components/articles';
import Testimonials from '@/components/testimonials';
import CTA from '@/components/cta';
import Footer from '@/components/footer';
import ArticleAdmin from '@/components/article-admin';

export default function Home() {
  const [adminOpen, setAdminOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onOpenAdmin={() => setAdminOpen(true)} />
      <main className="flex-1">
        <Hero />
        <Services />
        <Trust />
        <Articles />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
      {adminOpen && <ArticleAdmin onClose={() => setAdminOpen(false)} />}
    </div>
  );
}