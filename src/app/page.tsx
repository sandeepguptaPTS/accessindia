import { HeroSection } from "@/components/home/hero-section";
import { TrustBar } from "@/components/home/trust-bar";
import { NumbersSection } from "@/components/home/numbers-section";
import { WhatWeDoSection } from "@/components/home/what-we-do-section";
import { WhyUsSection } from "@/components/home/why-us-section";
import { TrustedBySection } from "@/components/home/trusted-by-section";
import { BackedBySection } from "@/components/home/backed-by-section";
import { ComplianceSearchSection } from "@/components/home/compliance-search-section";
import { CtaBanner } from "@/components/home/cta-banner";

export default function Home() {
  return (
    <div>
      <div className="min-h-[calc(100dvh-4rem)] flex flex-col">
        <HeroSection />
        <TrustBar />
      </div>
      <WhatWeDoSection />
      <WhyUsSection />
      <NumbersSection />
      <TrustedBySection />
      <BackedBySection />
      <ComplianceSearchSection />
      <CtaBanner />
    </div>
  );
}
