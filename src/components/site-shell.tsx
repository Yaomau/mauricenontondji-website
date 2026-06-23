'use client';

import { useState } from 'react';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import ArticleAdmin from '@/components/article-admin';

export default function SiteShell({
  children,
  currentPage,
}: {
  children: React.ReactNode;
  currentPage?: string;
}) {
  const [adminOpen, setAdminOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onOpenAdmin={() => setAdminOpen(true)} currentPage={currentPage} />
      <main className="flex-1">{children}</main>
      <Footer />
      {adminOpen && <ArticleAdmin onClose={() => setAdminOpen(false)} />}
    </div>
  );
}