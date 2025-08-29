import { Search, Menu, Bell, X, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLanguageData } from '@/hooks/useLanguageData';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const languageRef = useRef<HTMLDivElement>(null);
  const { setLanguage } = useLanguage();
  
  // 使用本地JSON文件获取header配置数据
  const { data: indexData, loading, error } = useLanguageData('index.json');

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
      if (languageRef.current && !languageRef.current.contains(event.target as Node)) {
        setIsLanguageOpen(false);
      }
    };

    if (isMenuOpen || isLanguageOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen, isLanguageOpen]);

  return (
    <header className="bg-news-card border-b border-border shadow-sm sticky top-0 z-50 backdrop-blur-sm bg-news-card/95">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">AI</span>
            </div>
            <h1 className="text-xl font-bold text-foreground">
              {indexData?.header?.logoText || 'AI新闻资讯'}
            </h1>
          </div>

          {/* Navigation */}
          <nav className="hidden xl:flex items-center space-x-8">
            {indexData?.header?.navItems?.map((item: any, index: number) => (
              <a 
                key={index}
                href={item.href}
                className="hover:text-blue-500 transition-colors hover:border-b-2 hover:border-blue-500"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Search and Actions */}
          <div className="flex items-center space-x-4 sm:space-x-1 sm:m-0">
            {/* 移动端搜索按钮 */}
            <Button variant="ghost" size="icon" className="sm:hidden text-muted-foreground hover:text-primary">
              <Search className="w-5 h-5" />
            </Button>
            
            {/* 桌面端搜索框 */}
            <div className="hidden sm:flex items-center relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="search"
                placeholder={indexData?.header?.searchPlaceholder || "搜索AI新闻..."}
                className="pl-10 w-64 hover:border-blue-500"
              />
            </div>
            
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary hover:bg-blue-100 sm:space-x-1">
              <Bell className="w-5 h-5" />
            </Button>

            {/* 语言切换按钮 */}
            <div className="relative" ref={languageRef}>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-muted-foreground hover:text-primary hover:bg-blue-100"
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
              >
                <Languages className="w-5 h-5" />
              </Button>
              
              {/* 语言选择菜单 */}
              {isLanguageOpen && (
                <div className="absolute right-0 top-12 bg-white border border-blue-300 rounded-md shadow-lg z-50 min-w-32">
                  <div className="py-1">
                    {indexData?.header?.languageOptions?.map((option: any, index: number) => (
                      <button 
                        key={index}
                        className="w-full px-4  py-2 text-left text-sm text-gray-800 hover:bg-blue-100 transition-colors"
                        onClick={() => {
                          setIsLanguageOpen(false);
                          if (option.value === 'ch' || option.value === 'en') {
                            setLanguage(option.value);
                          }
                        }}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* 移动端汉堡菜单 */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="xl:hidden sm:space-x-0"
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
                  className="fixed inset-0 bg-black/20 z-40 xl:hidden"
                  onClick={() => setIsMenuOpen(false)}
                />
                <div 
                  ref={menuRef}
                  className="xl:hidden bg-news-card border-t border-border fixed top-16 left-0 right-0 z-30" 
                  onClick={(e) => e.stopPropagation()}
                >
                  <nav className="container mx-auto flex flex-col ">
                    {indexData?.header?.navItems?.map((item: any, index: number) => (
                      <a 
                        key={index}
                        href={item.href}
                        className="text-muted-foreground hover:text-black transition-colors border-b border-border/50 py-2 px-3 hover:bg-blue-400"
                      >
                        {item.label}
                      </a>
                    ))}
                  </nav>
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;