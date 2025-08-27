import { Search, Menu, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Header = () => {
  return (
    <header className="bg-news-card border-b border-border shadow-sm sticky top-0 z-50 backdrop-blur-sm bg-news-card/95">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">AI</span>
            </div>
            <h1 className="text-xl font-bold text-foreground">AI新闻资讯</h1>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-foreground hover:text-primary transition-colors font-medium">
              首页
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              科技
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              机器学习
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              深度学习
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              行业应用
            </a>
          </nav>

          {/* Search and Actions */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="search"
                placeholder="搜索AI新闻..."
                className="pl-10 w-64 bg-news-background border-border focus:border-primary"
              />
            </div>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
              <Bell className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;