'use client';

import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

export default function SiteShell({
  children,
  currentPage,
}: {
  children: React.ReactNode;
  currentPage?: string;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar currentPage={currentPage} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}