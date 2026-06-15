import { auth } from '@clerk/nextjs/server';
import { HeroSection } from '@/components/home/hero-section';
import { ProblemAlignment } from '@/components/progress-dashboard/problem-alignment';
import { FeaturesSection } from '@/components/home/features-section';
import { HowItWorks } from '@/components/home/how-it-works';
import { CTASection } from '@/components/home/cta-section';

export default async function Home() {
  const { userId } = await auth();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1 w-full flex flex-col items-center">
        {/* Hero Section */}
        <HeroSection userId={userId} />

        {/* Problem Statement Section */}
        <div className="w-full bg-muted/30 border-y border-border">
          <ProblemAlignment />
        </div>
        
        {/* How It Works Section */}
        <HowItWorks />

        {/* Features Showcase Section */}
        <FeaturesSection />

        {/* Final CTA Section */}
        <CTASection userId={userId} />
      </main>
    </div>
  );
}
