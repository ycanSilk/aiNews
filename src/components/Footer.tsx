import { Github, Twitter, Mail, Rss, Share2, Facebook, Linkedin, MessageCircle } from "lucide-react";

const Footer = () => {

  return (
    <footer className="bg-foreground text-background py-5">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 text-center">
          {/* Logo and Description */}
          <div className="space-y-4 md:space-y-6 flex flex-col items-center">
            <div className="flex items-center space-x-2">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center">
                <img src="public/ainewslogo.png" alt="" />
              </div>
              <h3 className="text-lg font-bold">AI News Hub</h3>
            </div>
            <p className="text-background/70 text-sm">
              Focusing on the latest developments in artificial intelligence
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-center">
            <h4 className="font-semibold mb-4">Friendly Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="text-background/70 hover:text-background transition-colors">Home</a></li>            
            </ul>
          </div>

       

          {/* Social Links */}
          <div className="flex flex-col items-center">
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <div className="flex justify-center md:justify-start">
              <a href="mailto:gg2235676091@gmail.com" className="text-background/70 hover:text-background transition-colors flex items-center gap-2">
                <Mail className="w-5 h-5" />
                gg2235676091@gmail.com
              </a>
            </div>
          </div>

          {/* Social Share Buttons */}
          <div className="flex flex-col items-center">
            <h4 className="font-semibold mb-4">Share</h4>
            <div className="flex space-x-3">
              {/* Twitter Share */}
              <button
                onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent('Check out NewAI News - Latest AI Technology Updates')}&url=${encodeURIComponent(window.location.href)}`, '_blank')}
                className="text-background/70 hover:text-blue-400 transition-colors"
                aria-label="Share on Twitter"
              >
                <Twitter className="w-5 h-5" />
              </button>

              {/* Facebook Share */}
              <button
                onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}
                className="text-background/70 hover:text-blue-600 transition-colors"
                aria-label="Share on Facebook"
              >
                <Facebook className="w-5 h-5" />
              </button>

              {/* LinkedIn Share */}
              <button
                onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank')}
                className="text-background/70 hover:text-blue-700 transition-colors"
                aria-label="Share on LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </button>

              {/* WhatsApp Share */}
              <button
                onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent('Check out this AI news: ' + window.location.href)}`, '_blank')}
                className="text-background/70 hover:text-green-500 transition-colors"
                aria-label="Share on WhatsApp"
              >
                <MessageCircle className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-background/20 text-center mt-5">
          <p className="text-background/70 text-sm mt-5">
            © 2025 newainews.com. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;