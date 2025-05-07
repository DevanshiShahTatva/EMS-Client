"use client";
import { usePathname } from "next/navigation";

// Custom components
import Footer from "@/components/common/Footer";
import Header from "@/components/common/Header";
import ContactSection from "@/components/landing-page-components/ContactSection";
import FeatureSection from "@/components/landing-page-components/FeatureSection";
import HeroSection from "@/components/landing-page-components/HeroSection";
import Gallary from "@/components/landing-page-components/Gallary";

export default function Home() {
  const currentPath = usePathname();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header activeLink={currentPath} />
      <HeroSection />
      <FeatureSection />
      <Gallary />
      <ContactSection />
      {/* Footer */}
      <Footer />
    </div>
  );
}
