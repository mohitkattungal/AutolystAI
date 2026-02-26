import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { StatsBar } from "@/components/landing/stats-bar";
import { DualAudience } from "@/components/landing/dual-audience";
import { HowItWorks } from "@/components/landing/how-it-works";
import { FeaturesGrid } from "@/components/landing/features-grid";
import { LifecycleSection } from "@/components/landing/lifecycle-section";
import { WhatIfSimulator } from "@/components/landing/what-if-simulator";
import { IndustryUseCases } from "@/components/landing/industry-use-cases";
import { Testimonials } from "@/components/landing/testimonials";
import { Pricing } from "@/components/landing/pricing";
import { FAQ } from "@/components/landing/faq";
import { Footer } from "@/components/landing/footer";

export default function LandingPage() {
  return (
    <main className="dot-grid min-h-screen">
      <Navbar />
      <Hero />
      <StatsBar />
      <DualAudience />
      <HowItWorks />
      <FeaturesGrid />
      <LifecycleSection />
      <WhatIfSimulator />
      <IndustryUseCases />
      <Testimonials />
      <Pricing />
      <FAQ />
      <Footer />
    </main>
  );
}
