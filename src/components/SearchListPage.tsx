import NewsCard from "./NewsCard";

import Header from "./Header";
import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Eye, MessageSquare, Clock, Flame } from "lucide-react";
import { loadNewsData, loadCategoriesData, searchNewsByKeyword } from "../services/newsService";
import { NewsItemWithCategory, Category } from "../types/news";

const staticIndexData = {
  common: {
    loadingText: "Loading...",
    errorText: "Error loading data",
    backToTopText: "Back to Top",
    viewsText: "Views"
  },
  newsSection: {
    hotNewsTitle: "Hot News",
    allNewsText: "All news displayed",
    filteredText: "Filtered: {filtered} news, Displayed: {visible} items",
    dateRangeText: "Date Range",
    toText: "to"
  }
};

const SearchListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  // 状态管理
  const [newsData, setNewsData] = useState<NewsItemWithCategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState(searchParams.get('search') || '');
  const currentLanguage = 'en';
  
  // 加载数据
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoadingData(true);
        const [news, categories] = await Promise.all([
          loadNewsData(),
          loadCategoriesData()
        ]);
        setNewsData(news);
        setCategories(categories);
      } catch (error) {
        console.error('数据加载失败:', error);
      } finally {
        setIsLoadingData(false);
      }
    };

    loadData();
  }, []);


  // 处理搜索功能
  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword);
    // 重置到第一页以便显示搜索结果
    setVisibleCount(10);
    // 更新URL参数
    if (keyword.trim()) {
      searchParams.set('search', keyword.trim());
    } else {
      searchParams.delete('search');
    }
    setSearchParams(searchParams);
  };
  
  // 状态来跟踪返回顶部按钮显示状态
  const [showBackToTop, setShowBackToTop] = useState(false);

  // 监听URL参数变化
  useEffect(() => {
    const urlSearchKeyword = searchParams.get('search');
    if (urlSearchKeyword && urlSearchKeyword !== searchKeyword) {
      setSearchKeyword(urlSearchKeyword);
      setVisibleCount(10);
    }
  }, [searchParams, searchKeyword]);

  // 过滤和排序新闻数据
  const filteredNews = useMemo(() => {
    if (newsData.length === 0) return [];
    
    // 按关键词搜索
    let result = searchNewsByKeyword(newsData, searchKeyword);
    
    // 确保新闻按日期降序排列
    result.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    
    return result;
  }, [newsData, searchKeyword]);
  
  // 按日期分组所有新闻
  const visibleNews = useMemo(() => {
    if (filteredNews.length === 0) return {};
    
    const result: Record<string, typeof filteredNews> = {};
    
    // 遍历所有新闻，按日期分组
    for (const news of filteredNews) {
      // 安全处理日期格式
      const newsDate = news.publishedAt ? new Date(news.publishedAt).toISOString().split('T')[0] : 'unknown-date';
      
      if (!result[newsDate]) {
        result[newsDate] = [];
      }
      
      result[newsDate].push(news);
    }
    
    return result;
  }, [filteredNews]);
  

  
  // 添加显示无结果的提示
  const showNoResultsMessage = filteredNews.length === 0 && searchKeyword;
  

  



  



  

  
  // 监听滚动事件，显示返回顶部按钮
  useEffect(() => {
    const handleScroll = () => {
      // 当页面滚动超过300px时显示返回顶部按钮
      const scrollPosition = window.scrollY;
      setShowBackToTop(scrollPosition > 100);
    };
    
    // 监听窗口滚动事件
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [showNoResultsMessage]);

  // 简单的日期格式化函数
  const formatDateByLanguage = (dateString: string, language: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'ch' ? 'zh-CN' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // 简单的浏览量格式化函数
  const generateIncrementedViews = (views: number) => {
    if (views >= 1000) {
      return (views / 1000).toFixed(1) + 'k';
    }
    return views.toString();
  };

  return (
    <div className="min-h-screen">
      <section className="bg-news-background relative">
            
            {/* 搜索结果显示 */}
            {searchKeyword && (
              <div className="container mx-auto px-4 pt-4">
                <p className="text-sm text-muted-foreground">
                  Search "{searchKeyword}" found {filteredNews.length} results
                </p>
              </div>
            )}
      
      {/* 返回顶部按钮 - 固定在页面右下角，滚动超过300px时显示 */}
      <button
        onClick={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className={`fixed bottom-10 right-5 p-2 z-50 bg-primary text-white shadow-lg hover:bg-primary/90 transition-all duration-300 flex flex-col items-center justify-center rounded-md xs:rounded-full md:bottom-6 md:right-6 ${
          showBackToTop ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}

        aria-label="返回顶部"
      >
        <span className="text-lg">▲</span>
        <span className="text-xs leading-tight hidden md:block">{staticIndexData.common.backToTopText || '返回顶部'}</span>
      </button>
      
      {/* 新闻列表内容 */}
      <div className="container mx-auto px-4 py-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 pb-3 ">News List</h2>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* 主新闻列表 - 全宽度 */}
          <div className="w-full">
            {Object.entries(visibleNews).map(([date, newsItems]) => {
              const [year, month, day] = date.split('-');
              const monthDay = staticIndexData?.common?.dateFormat
                ?.replace('{month}', month || '')
                ?.replace('{day}', day || '')
                ?.replace('{weekday}', '') || formatDateByLanguage(date, currentLanguage);
              
              // 使用日期作为key，确保唯一性
              const uniqueKey = date;
              
              return (
                <div key={uniqueKey} className="mb-8">
                  {/* 日期分组标题栏 */}
                  <div className="mb-4 py-3 border-b-2 border-blue-500">
                    <div className="flex items-center">
                      <div className="w-1 h-8 bg-blue-500 mr-3"></div>
                      <h3 className="text-xl font-bold text-gray-800">
                        {monthDay}
                      </h3>
                    </div>
                  </div>
                  
                  {/* 该日期下的新闻列表 */}
                  <div className="space-y-4">
                    {newsItems.map((news) => (
                      <div key={news.id} className="w-full">
                        <NewsCard
                          title={news.title}
                          summary={news.content}
                          category={news.categoryName}
                          publishTime={news.publishedAt}
                          views={news.views}
                          tags={news.tags}
                          externalUrl={news.externalUrl}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
            
            {/* 无结果提示 */}
            {showNoResultsMessage && (
              <div className="text-center my-8">
                <p className="text-sm text-muted-foreground">
                  No relevant results found
                </p>
              </div>
            )}
            
            {/* 调试信息 - 仅用于开发环境 */}
            {process.env.NODE_ENV === 'development' && (
              <div className="text-xs text-gray-400 mt-2 text-center">
                {staticIndexData.newsSection.filteredText.replace('{filtered}', filteredNews.length.toString()).replace('{visible}', filteredNews.length.toString())}
              </div>
            )}
          </div>


        </div>
      </div>
    </section>
    </div>
  );
};

export default SearchListPage;