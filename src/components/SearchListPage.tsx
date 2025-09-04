import NewsCard from "./NewsCard";

import Header from "./Header";
import { useState, useMemo, useEffect } from "react";
import BackToTopButton from "./BackToTopButton";
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
  const [currentPage, setCurrentPage] = useState(1); // 当前页码
  const itemsPerPage = 10; // 每页显示10条新闻
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
    setCurrentPage(1);
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
      setCurrentPage(1);
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
  
  // 按日期分组可见新闻
  const visibleNews = useMemo(() => {
    if (filteredNews.length === 0) return {};
    
    const result: Record<string, typeof filteredNews> = {};
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredNews.length);
    
    // 遍历当前页的新闻，按日期分组
    for (let i = startIndex; i < endIndex; i++) {
      const news = filteredNews[i];
      // 安全处理日期格式
      const newsDate = news.publishedAt ? new Date(news.publishedAt).toISOString().split('T')[0] : 'unknown-date';
      
      if (!result[newsDate]) {
        result[newsDate] = [];
      }
      
      result[newsDate].push(news);
    }
    
    return result;
  }, [filteredNews, currentPage]);
  

  
  // 添加显示无结果的提示
  const showNoResultsMessage = filteredNews.length === 0 && searchKeyword;

  // 分页导航函数
  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  // 计算总页数
  const totalPages = Math.ceil(filteredNews.length / itemsPerPage);

  // 生成页码数组
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };
  

  



  



  

  
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
      
      {/* 返回顶部按钮组件 */}
      <BackToTopButton threshold={100} />
      
      {/* 新闻列表内容 */}
      <div className="container mx-auto px-4 py-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 pb-3 ">AI News List</h2>
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
            
            {/* 分页控件 */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center items-center space-x-2">
                {/* 上一页按钮 */}
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                {/* 页码按钮 */}
                {getPageNumbers().map(page => (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`px-3 py-2 border rounded-md text-sm font-medium ${
                      currentPage === page
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                {/* 下一页按钮 */}
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
                
                {/* 页面信息 */}
                <span className="text-sm text-gray-500 ml-4">
                  Page {currentPage} of {totalPages}
                </span>
              </div>
            )}
            
            {showNoResultsMessage && (
              <p className="text-sm text-muted-foreground text-center my-8">
                没有找到相关新闻
              </p>
            )}
            
            {/* 调试信息 - 仅用于开发环境 */}
            {process.env.NODE_ENV === 'development' && (
              <div className="text-xs text-gray-400 mt-2 text-center">
                {staticIndexData.newsSection.filteredText.replace('{filtered}', filteredNews.length.toString()).replace('{visible}', (currentPage * itemsPerPage).toString())}
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