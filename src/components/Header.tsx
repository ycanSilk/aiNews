import { Search, Menu, Bell, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface HeaderProps {
  onSearch: (keyword: string) => void;
}

const Header = ({ onSearch }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationDialogOpen, setIsNotificationDialogOpen] = useState(false);
  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false);
  const [searchInputValue, setSearchInputValue] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  // 直接使用英文数据
  const currentLanguage = 'en';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <header className="bg-news-card border-b border-border shadow-sm sticky top-0 z-50 backdrop-blur-sm bg-news-card/95">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <img 
              src="/ainewslogo.png" 
              alt="AI News Logo" 
              className="w-8 h-8 object-contain"
            />
            <h1 className="text-xl font-bold text-foreground">
              AI News
            </h1>
          </div>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center space-x-4 xl:space-x-8">
            <a href="/" className="hover:text-blue-500 transition-colors hover:border-b-2 hover:border-blue-500">
              Home
            </a>
            <a href="/news" className="hover:text-blue-500 transition-colors hover:border-b-2 hover:border-blue-500">
              News
            </a>
            <a href="/blog" className="hover:text-blue-500 transition-colors hover:border-b-2 hover:border-blue-500">
              Blog
            </a>
            <a href="/timeline" className="hover:text-blue-500 transition-colors hover:border-b-2 hover:border-blue-500">
              Timeline News
            </a>
            <a href="/about" className="hover:text-blue-500 transition-colors hover:border-b-2 hover:border-blue-500">
              About Us
            </a>
          </nav>

          {/* Search and Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
            {/* 移动端搜索按钮 */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden text-muted-foreground hover:text-primary"
              onClick={() => setIsSearchDialogOpen(true)}
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
            
            {/* 桌面端搜索框 */}
            <div className="hidden md:flex items-center relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="search"
                placeholder="Search AI news..."
                className="pl-10 w-40 lg:w-56 xl:w-64 hover:border-blue-500 transition-all duration-300"
                onChange={(e) => onSearch(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                    navigate(`/news?search=${encodeURIComponent(e.currentTarget.value.trim())}`);
                  }
                }}
              />
            </div>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-muted-foreground hover:text-primary hover:bg-blue-100"
              onClick={() => setIsNotificationDialogOpen(true)}
            >
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>

            
            {/* 移动端汉堡菜单 */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-4 h-4 sm:w-5 sm:h-5" /> : <Menu className="w-4 h-4 sm:w-5 sm:h-5" />}
            </Button>
          </div>
        </div>
        
        {/* 移动端导航菜单 */}
            {isMenuOpen && (
              <>
                {/* 点击外部关闭菜单的遮罩层 */}
                <div 
                  className="fixed inset-0 bg-black/20 z-40 lg:hidden"
                  onClick={() => setIsMenuOpen(false)}
                />
                <div 
                  ref={menuRef}
                  className="lg:hidden bg-news-card border border-border rounded-lg shadow-lg fixed top-16 right-2 sm:right-4 z-30 w-auto min-w-[140px] sm:min-w-[160px]" 
                  onClick={(e) => e.stopPropagation()}
                >
                  <nav className="flex flex-col p-2">
                    <a href="/" className="text-muted-foreground hover:text-black transition-colors rounded-md py-2 px-3 hover:bg-blue-400">
                      Home
                    </a>
                    <a href="/news" className="text-muted-foreground hover:text-black transition-colors rounded-md py-2 px-3 hover:bg-blue-400">
                      News
                    </a>
                    <a href="/blog" className="text-muted-foreground hover:text-black transition-colors rounded-md py-2 px-3 hover:bg-blue-400">
                      Blog
                    </a>
                    <a href="/timeline" className="text-muted-foreground hover:text-black transition-colors rounded-md py-2 px-3 hover:bg-blue-400">
                      Timeline News
                    </a>
                    <a href="/about" className="text-muted-foreground hover:text-black transition-colors rounded-md py-2 px-3 hover:bg-blue-400">
                      About Us
                    </a>
                  </nav>
            </div>
          </>
        )}

        <Dialog open={isNotificationDialogOpen} onOpenChange={setIsNotificationDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-center">Notifications</DialogTitle>
              <DialogDescription className="text-center">
                Notification feature will be available soon.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-center mt-4">
              <Button onClick={() => setIsNotificationDialogOpen(false)}>
                Confirm
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* 搜索模态框 */}
        <Dialog open={isSearchDialogOpen} onOpenChange={setIsSearchDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-center">Search</DialogTitle>
              <DialogDescription className="text-center">
                Enter keywords to search AI news
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              <Input
                type="search"
                placeholder="Search AI news..."
                value={searchInputValue}
                onChange={(e) => setSearchInputValue(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && searchInputValue.trim()) {
                    navigate(`/news?search=${encodeURIComponent(searchInputValue.trim())}`);
                    setIsSearchDialogOpen(false);
                    setSearchInputValue('');
                  }
                }}
                className="w-full"
                autoFocus
              />
            </div>
            <div className="flex justify-center gap-4 mt-6">
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsSearchDialogOpen(false);
                  setSearchInputValue('');
                }}
              >
                Cancel
              </Button>
              <Button 
                onClick={() => {
                  if (searchInputValue.trim()) {
                    navigate(`/news?search=${encodeURIComponent(searchInputValue.trim())}`);
                    setIsSearchDialogOpen(false);
                    setSearchInputValue('');
                  }
                }}
                disabled={!searchInputValue.trim()}
              >
                Search
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </header>
  );
};

export default Header;