import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import NewsList from "@/components/NewsList";
import Footer from "@/components/Footer";

const IndexEN = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <NewsList />
      <Footer />
    </div>
  );
};

export default IndexEN;