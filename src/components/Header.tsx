import { Search, Menu, Bell, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
              博客
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              时间线
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              关于我们
            </a>
          </nav>

          {/* Search and Actions */}
          <div className="flex items-center space-x-4">
            {/* 移动端搜索按钮 */}
            <Button variant="ghost" size="icon" className="sm:hidden text-muted-foreground hover:text-primary">
              <Search className="w-5 h-5" />
            </Button>
            
            {/* 桌面端搜索框 */}
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
            
            {/* 移动端汉堡菜单 */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
        
        {/* 移动端导航菜单 */}
        {isMenuOpen && (
          <>
            {/* 点击外部关闭菜单的遮罩层 */}
            <div 
              className="fixed inset-0 bg-black/20 z-40 md:hidden"
              onClick={(e) => {
                console.log('点击外部遮罩层，关闭菜单');
                // 判断点击的是否是菜单容器元素，如果不是则关闭菜单
                const menuContainer = e.target.closest('.md\:hidden.bg-news-card');
                if (!menuContainer) {
                  setIsMenuOpen(false);
                }
              }}
            />
            <div className="md:hidden bg-news-card border-t border-border fixed top-16 left-0 right-0 z-30" onClick={(e) => e.stopPropagation()}>
              <nav className="container mx-auto px-4 py-4 flex flex-col space-y-4">
                <a href="#" className="text-foreground hover:text-primary transition-colors font-medium border-b border-border/50 pb-2">
                  首页
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors border-b border-border/50 pb-2">
                  博客
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors border-b border-border/50 pb-2">
                  时间线
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors border-b border-border/50 pb-2">
                  关于我们
                </a>
              </nav>
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;