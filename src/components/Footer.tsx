import { Github, Twitter, Mail, Rss } from "lucide-react";

const Footer = () => {

  return (
    <footer className="bg-foreground text-background py-5">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 text-center">
          {/* Logo and Description */}
          <div className="space-y-4 md:space-y-6 flex flex-col items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">AI</span>
              </div>
              <h3 className="text-lg font-bold">AI News Hub</h3>
            </div>
            <p className="text-background/70 text-sm">
              Focusing on the latest developments in artificial intelligence
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-center">
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="text-background/70 hover:text-background transition-colors">Home</a></li>
              <li><a href="/news" className="text-background/70 hover:text-background transition-colors">Tech News</a></li>
              <li><a href="/machine-learning" className="text-background/70 hover:text-background transition-colors">Machine Learning</a></li>
              <li><a href="/deep-learning" className="text-background/70 hover:text-background transition-colors">Deep Learning</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="flex flex-col items-center">
            <h4 className="font-semibold mb-4 text-center">Categories</h4>
            <ul className="space-y-2 text-sm">
                <li><a href="/llm" className="text-background/70 hover:text-background transition-colors">Large Language Models</a></li>
              <li><a href="/cv" className="text-background/70 hover:text-background transition-colors">Computer Vision</a></li>
              <li><a href="/autonomous" className="text-background/70 hover:text-background transition-colors">Autonomous Driving</a></li>
              <li><a href="/medical-ai" className="text-background/70 hover:text-background transition-colors">Medical AI</a></li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="flex flex-col items-center">
            <h4 className="font-semibold mb-4">Follow Us</h4>
            <div className="flex justify-center md:justify-start">
              <a href="mailto:gg2235676091@gmail.com" className="text-background/70 hover:text-background transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-background/20 text-center mt-5">
          <p className="text-background/70 text-sm mt-5">
            © 2024 AI News Hub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;