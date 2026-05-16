import Navbar from '@/components/landing/Navbar';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import AIShowcase from '@/components/landing/AIShowcase';
import WorkflowSection from '@/components/landing/WorkflowSection';
import CTASection from '@/components/landing/CTASection';
import Footer from '@/components/landing/Footer';

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <AIShowcase />
      <WorkflowSection />
      <CTASection />
      <Footer />
    </main>
  );
}
