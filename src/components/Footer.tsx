import { Github, Twitter, Mail, Rss } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 text-center">
          {/* Logo and Description */}
          <div className="space-y-4 md:space-y-6 flex flex-col items-center md:items-start">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">AI</span>
              </div>
              <h3 className="text-lg font-bold">AI新闻资讯</h3>
            </div>
            <p className="text-background/70 text-sm">
              专注于人工智能领域的最新动态
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="font-semibold mb-4">快速链接</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-background/70 hover:text-background transition-colors">首页</a></li>
              <li><a href="#" className="text-background/70 hover:text-background transition-colors">科技新闻</a></li>
              <li><a href="#" className="text-background/70 hover:text-background transition-colors">机器学习</a></li>
              <li><a href="#" className="text-background/70 hover:text-background transition-colors">深度学习</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="font-semibold mb-4">分类</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-background/70 hover:text-background transition-colors">大语言模型</a></li>
              <li><a href="#" className="text-background/70 hover:text-background transition-colors">计算机视觉</a></li>
              <li><a href="#" className="text-background/70 hover:text-background transition-colors">自动驾驶</a></li>
              <li><a href="#" className="text-background/70 hover:text-background transition-colors">医疗AI</a></li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="font-semibold mb-4">关注我们</h4>
            <div className="flex space-x-4 md:space-x-6 justify-center md:justify-start">
              <a href="#" className="text-background/70 hover:text-background transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-background/70 hover:text-background transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-background/70 hover:text-background transition-colors">
                <Mail className="w-5 h-5" />
              </a>
              <a href="#" className="text-background/70 hover:text-background transition-colors">
                <Rss className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-background/20 mt-8 pt-8 text-center">
          <p className="text-background/70 text-sm">
            © 2024 AI新闻资讯. 保留所有权利.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;