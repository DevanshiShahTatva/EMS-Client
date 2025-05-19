"use client";

// Custom components
import Footer from "@/components/common/Footer";
import ContactSection from "@/components/landing-page-components/ContactSection";
import FeatureSection from "@/components/landing-page-components/FeatureSection";
import HeroSection from "@/components/landing-page-components/HeroSection";
import Gallary from "@/components/landing-page-components/Gallary";
import CommonUserLayout from "@/components/common/CommonUserLayout";

// Constant
import { ROLE } from "@/utils/constant";

export default function Home() {

  return (
    <CommonUserLayout role={ROLE.User}>
      <div className={`flex flex-col`}>
        <HeroSection />
        <FeatureSection />
        <Gallary />
        <ContactSection />
        <Footer />
      </div>
      </CommonUserLayout>
  );
}
