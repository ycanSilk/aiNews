import { Button } from "@/components/ui/button";
import { ArrowRight, Zap } from "lucide-react";
import heroImage from "@/assets/hero-ai-news.jpg";

const HeroSection = () => {

  return (
    <section className="relative bg-gradient-to-br from-tech-blue via-primary to-tech-blue overflow-hidden" style={{ backgroundImage: `url(${heroImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="absolute inset-0 bg-black/50"></div>
      <div className="relative container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-white space-y-4 md:space-y-6">
            <div className="flex items-center space-x-2 text-white/90">
              <Zap className="w-6 h-6 md:w-10 md:h-10" />
              <h2 className="text-2xl md:text-4xl font-medium">Real-time AI News</h2>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold leading-tight">
              Latest AI Technology Updates
            </h1>
            <p className="text-base md:text-lg text-white/90 max-w-md">
              Get the latest AI technology news, breakthroughs and industry insights. Stay informed about every important moment in AI development.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-white text-primary hover:bg-white/90 font-semibold"
              >
                Subscribe
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;