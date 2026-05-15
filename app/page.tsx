import Navbar from "@/components/Navbar";
import HeroCarousel from "@/components/HeroCarousel";
import ProductsSection from "@/components/ProductsSections";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroCarousel />
      <ProductsSection />
      <AboutSection />
      <Footer />
    </main>
  );
}
