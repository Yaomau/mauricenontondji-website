import Hero from '@/components/hero';
import Services from '@/components/services';
import Trust from '@/components/trust';
import HomeArticles from '@/components/articles';
import Testimonials from '@/components/testimonials';
import CTA from '@/components/cta';
import SiteShell from '@/components/site-shell';

export default function Home() {
  return (
    <SiteShell currentPage="home">
      <Hero />
      <Services />
      <Trust />
      <HomeArticles />
      <Testimonials />
      <CTA />
    </SiteShell>
  );
}