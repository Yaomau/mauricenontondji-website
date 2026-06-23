import Navbar from '@/components/navbar';
import Hero from '@/components/hero';
import Services from '@/components/services';
import Trust from '@/components/trust';
import Articles from '@/components/articles';
import Testimonials from '@/components/testimonials';
import CTA from '@/components/cta';
import Footer from '@/components/footer';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Services />
        <Trust />
        <Articles />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}