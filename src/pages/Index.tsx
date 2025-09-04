import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import NewsList from "@/components/NewsList";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="NewAI News - Latest AI Technology News & Trends"
        description="Get breaking AI news on DeepSeek, OpenAI GPT-5, ChatGPT, Claude, Gemini, Llama and Meta AI. Your source for artificial intelligence technology updates and industry trends."
        keywords="ai news, newainews, deepseek, openai gpt-5, chatgpt, claude, gemini, llama, meta ai, artificial intelligence news, machine learning, large language models"
        canonical="https://newainews.com"
        ogImage="https://newainews.com/og-image.png"
        ogType="website"
      />
      <Header />
      <HeroSection />
      <NewsList />
      <Footer />
    </div>
  );
};

export default Index;
