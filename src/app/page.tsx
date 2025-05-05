"use client"
import { usePathname } from "next/navigation";

// Custom components
import Footer from "@/components/common/Footer";
import Header from "@/components/common/Header";
import Testimonials from "@/components/landing-page-components/Testimonials";
import FeatureSection from "@/components/landing-page-components/FeatureSection";
import HeroSection from "@/components/landing-page-components/HeroSection";

const Home = () => {
  const currentPath = usePathname()

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header activeLink={currentPath} />

      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <FeatureSection />

      {/* Testimonials Section */}
      <Testimonials />

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Home;