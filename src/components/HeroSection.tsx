import { Button } from "@/components/ui/button";
import { ArrowRight, Zap } from "lucide-react";
import heroImage from "@/assets/hero-ai-news.jpg";

const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-br from-tech-blue via-primary to-tech-blue overflow-hidden">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="relative container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-white space-y-6">
            <div className="flex items-center space-x-2 text-white/90">
              <Zap className="w-5 h-5" />
              <span className="text-sm font-medium">实时AI资讯</span>
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
              AI科技
              <span className="block bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                最新动态
              </span>
            </h1>
            <p className="text-lg text-white/90 max-w-md">
              获取最新的人工智能新闻、技术突破和行业洞察。掌握AI发展的每一个重要时刻。
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-white text-primary hover:bg-white/90 font-semibold"
              >
                开始阅读
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-white/30 text-white hover:bg-white/10 hover:text-white"
              >
                订阅更新
              </Button>
            </div>
          </div>
          <div className="relative">
            <img
              src={heroImage}
              alt="AI Technology"
              className="rounded-2xl shadow-2xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;