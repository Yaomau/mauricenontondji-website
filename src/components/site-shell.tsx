'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
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
  const { data: session } = useSession();

  const handleOpenAdmin = () => {
    if (session) {
      setAdminOpen(true);
    }
    // If not authenticated, the navbar login modal will be shown instead
  };

  // Listen for custom event from navbar when auth succeeds
  useEffect(() => {
    const handleAuthSuccess = () => {
      setAdminOpen(true);
    };
    window.addEventListener('admin-auth-success', handleAuthSuccess);
    return () => window.removeEventListener('admin-auth-success', handleAuthSuccess);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar onOpenAdmin={handleOpenAdmin} currentPage={currentPage} />
      <main className="flex-1">{children}</main>
      <Footer />
      {adminOpen && session && <ArticleAdmin onClose={() => setAdminOpen(false)} />}
    </div>
  );
}