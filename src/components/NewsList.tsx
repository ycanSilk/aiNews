import NewsCard from "./NewsCard";
import CategoryTabs from "./CategoryTabs";
import DateFilter from "./DateFilter";
import Header from "./Header";
import { useState, useMemo, useEffect, useRef } from "react";
import { Eye, MessageSquare, Clock, Flame, Loader2 } from "lucide-react";
import { loadNewsData, loadCategoriesData, getHotNews, filterNewsByCategory, filterNewsByDateRange, searchNewsByKeyword } from "../services/newsService";
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

const NewsList = () => {
  // 状态管理
  const [newsData, setNewsData] = useState<NewsItemWithCategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');
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

  // 状态来跟踪当前选中的分类
  const [activeCategory, setActiveCategory] = useState("All");
  // 状态来跟踪日期筛选 - 默认显示最近一周的新闻
  const [dateRange, setDateRange] = useState<{start: string | null, end: string | null}>({
    start: null,
    end: null
  });
  // 状态来跟踪日期范围按钮的显示文本
  const [dateRangeText, setDateRangeText] = useState<string>('Last Week');
  // 处理搜索功能
  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword);
    // 重置到第一页以便显示搜索结果
    setVisibleCount(10);
  };
  
  // 状态来跟踪懒加载
  const [visibleCount, setVisibleCount] = useState(10); // 初始显示10条新闻
  const [isLoading, setIsLoading] = useState(false); // 加载状态
  const [showBackToTop, setShowBackToTop] = useState(false); // 返回顶部按钮显示状态
  const loaderRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 过滤和排序新闻数据
  const filteredNews = useMemo(() => {
    if (newsData.length === 0) return [];
    
    // 按分类筛选
    let result = filterNewsByCategory(newsData, activeCategory);
    
    // 按日期范围筛选
    result = filterNewsByDateRange(result, dateRange.start, dateRange.end);
    
    // 按关键词搜索
    result = searchNewsByKeyword(result, searchKeyword);
    
    // 确保新闻按日期降序排列
    result.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    
    return result;
  }, [newsData, activeCategory, dateRange.start, dateRange.end, searchKeyword]);
  
  // 处理懒加载的可见新闻
  const visibleNews = useMemo(() => {
    if (filteredNews.length === 0) return {};
    
    const result: Record<string, typeof filteredNews> = {};
    let count = 0;
    
    // 直接遍历已排序的新闻，按日期分组直到达到可见数量
    for (const news of filteredNews) {
      if (count >= visibleCount) break;
      
      // 安全处理日期格式
      const newsDate = news.publishedAt ? new Date(news.publishedAt).toISOString().split('T')[0] : 'unknown-date';
      
      if (!result[newsDate]) {
        result[newsDate] = [];
      }
      
      result[newsDate].push(news);
      count++;
    }
    
    return result;
  }, [filteredNews, visibleCount]);
  
  // 当日期范围变化时，强制重新计算可见新闻
  useEffect(() => {
    if (dateRange.start || dateRange.end) {
      // 强制更新可见数量，确保重新计算
      setVisibleCount(prev => prev + 0);
    }
  }, [dateRange]);
  
  // 添加显示日期筛选结果的提示
  const showNoResultsMessage = filteredNews.length === 0 && (dateRange.start || dateRange.end);
  
  // 检查是否选择了未来日期
  const hasFutureDateSelection = useMemo(() => {
    if (!dateRange.start || !dateRange.end) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(dateRange.end) > today;
  }, [dateRange]);
  
  // 处理日期范围变化
  const handleDateRangeChange = (startDate: string | null, endDate: string | null) => {
    // 当选择'all'选项时，直接传递null值，不需要验证
    if (startDate === null && endDate === null) {
      setDateRange({ start: null, end: null });
      return;
    }
    
    // 验证日期范围有效性
    let validStartDate = startDate;
    let validEndDate = endDate;
    
    // 获取当前日期
    // 使用北京时间时区 (UTC+8)
    const now = new Date();
    const beijingOffset = 8 * 60; // 北京时间 UTC+8
    const localOffset = now.getTimezoneOffset(); // 本地时区偏移（分钟）
    const beijingTime = new Date(now.getTime() + (beijingOffset + localOffset) * 60 * 1000);
    
    const today = beijingTime;
    today.setHours(0, 0, 0, 0);
    
    // 检查是否选择了未来日期（不再自动调整，允许显示未来日期的新闻）
    if (endDate && new Date(endDate) > today) {
      // 不再自动调整结束日期，允许用户选择未来日期
    }
    
    // 确保开始日期不晚于结束日期
    if (validStartDate && validEndDate && new Date(validStartDate) > new Date(validEndDate)) {
      validStartDate = validEndDate;
    }
    
    setDateRange({ start: validStartDate, end: validEndDate });
  };

  // 热门新闻数据 - 按浏览量降序排列取前10条
  const hotNews = useMemo(() => {
    return getHotNews(newsData, 10);
  }, [newsData]);
  
  // 当分类或日期范围改变时，重置可见数量
  useEffect(() => {
    setVisibleCount(10);
  }, [activeCategory, dateRange]);

  // 当新闻数据加载完成时，设置默认日期范围为最近一周
  useEffect(() => {
    if (newsData && newsData.length > 0 && !dateRange.start && !dateRange.end) {
      // 使用北京时间时区 (UTC+8)
      const now = new Date();
      const beijingOffset = 8 * 60; // 北京时间 UTC+8
      const localOffset = now.getTimezoneOffset(); // 本地时区偏移（分钟）
      const beijingTime = new Date(now.getTime() + (beijingOffset + localOffset) * 60 * 1000);
      
      const today = beijingTime;
      const oneWeekAgo = new Date(beijingTime);
      oneWeekAgo.setDate(today.getDate() - 6); // -6 确保包含7天（包括今天）
      
      const formatDate = (date: Date) => date.toISOString().split('T')[0];
      
      setDateRange({
        start: formatDate(oneWeekAgo),
        end: formatDate(today)
      });
    }
  }, [newsData, dateRange.start, dateRange.end]);
  
  // 加载更多新闻
  const loadMoreNews = () => {
    if (isLoading || visibleCount >= filteredNews.length) return;
    
    setIsLoading(true);
    
    // 2秒延迟
    setTimeout(() => {
      setVisibleCount(prevCount => {
        const newCount = Math.min(prevCount + 10, filteredNews.length);
        setIsLoading(false);
        return newCount;
      });
    }, 500);
  };
  
  // 监听滚动事件，实现无限滚动和返回顶部按钮显示
  useEffect(() => {
    const handleScroll = () => {
      if (isLoading || showNoResultsMessage || visibleCount >= filteredNews.length) return;
      
      const loader = loaderRef.current;
      
      if (!loader) return;
      
      const loaderRect = loader.getBoundingClientRect();
      
      // 当加载器进入视口时，加载更多
      if (loaderRect.top < window.innerHeight + 300) {
        loadMoreNews();
      }
      
      // 当页面滚动超过300px时显示返回顶部按钮（参考gundong.html实现）
      const scrollPosition = window.scrollY;
      setShowBackToTop(scrollPosition > 100);
    };
    
    // 监听窗口滚动事件
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isLoading, visibleCount, filteredNews.length, showNoResultsMessage, loadMoreNews]);

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
      {/* 分类标签切换组件 */}
            <CategoryTabs 
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />
            
            {/* 搜索结果显示 */}
            {searchKeyword && (
              <div className="container mx-auto px-4 pt-4">
                <p className="text-sm text-muted-foreground">
                  搜索 "{searchKeyword}" 找到 {filteredNews.length} 条结果
                </p>
              </div>
            )}
      
      {/* 日期筛选组件 */}
      <div className="container mx-auto px-4 pt-6">
        <DateFilter 
          onDateRangeChange={handleDateRangeChange} 
          onRangeTextChange={setDateRangeText}
        />
      </div>
      
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
        <div className="flex flex-col lg:flex-row gap-8">
          {/* 主新闻列表 - 移动端全宽，桌面端70%宽度 */}
          <div className="w-full lg:w-9/12">
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
            
            {/* 加载状态显示 */}
            <div className="text-center my-8" ref={loaderRef}>
              {isLoading ? (
                <div className="flex flex-col items-center">
                  <Loader2 className="w-8 h-8 text-primary animate-spin mb-2" />
                  <p className="text-sm text-muted-foreground">{staticIndexData.common.loadingText}</p>
                </div>
              ) : showNoResultsMessage ? (
                <p className="text-sm text-muted-foreground">
                  {dateRange.start && dateRange.end && (
                    <> ({
                      dateRange.start === dateRange.end 
                        ? dateRange.start 
                        : `${dateRange.start} 至 ${dateRange.end}`
                    }) </>
                  )}
                </p>
              ) : visibleCount >= filteredNews.length ? (
                <p className="text-sm text-muted-foreground">{staticIndexData.newsSection.allNewsText}</p>
              ) : null}
            </div>
            
            {/* 调试信息 - 仅用于开发环境 */}
            {process.env.NODE_ENV === 'development' && (
              <div className="text-xs text-gray-400 mt-2 text-center">
                {staticIndexData.newsSection.filteredText.replace('{filtered}', filteredNews.length.toString()).replace('{visible}', visibleCount.toString())}
                {dateRange.start && dateRange.end && `, ${staticIndexData.newsSection.dateRangeText}: ${dateRange.start} ${staticIndexData.newsSection.toText} ${dateRange.end}`}
              </div>
            )}
          </div>

          {/* 热门新闻侧边栏 - 移动端隐藏，桌面端25%宽度 */}
          <div className="hidden lg:block lg:w-3/12 sticky top-20 self-start">
            <div className="bg-news-card rounded-none py-3 px-5 border border-border">
              <h3 className="text-xl font-bold text-foreground mb-6 flex items-center">
                <span className="w-6 h-6 rounded-full  flex items-center justify-center text-red-500 mr-3">
                    <Flame className="w-7 h-7" />
                </span>
                {staticIndexData.newsSection.hotNewsTitle}
              </h3>
              
              <div className="space-y-6">
                {hotNews.map((news, index) => (
                  <div key={`hot-news-${news.id}-${index}`} className="flex space-x-3 items-start">
                    {/* 火焰图标和排名数字 */}
                    <div className="flex flex-col items-center space-y-1">
                      <span className="text-xs font-bold text-gray-500 bg-red-500 w-5 h-5 flex text-white items-center justify-center">{index + 1}</span>
                    </div>
                    {/* 新闻内容 */}
                    <div className="flex-1">
                      <h4 className="text-sm font-medium hover:text-primary transition-colors cursor-pointer">
                        {news.title}
                      </h4>
                      <div className="flex items-center mt-1 text-xs text-gray-500 space-x-2">
                        <span>{formatDateByLanguage(news.publishedAt || '', currentLanguage)}</span>
                        <span>•</span>
                        <span>{generateIncrementedViews(news.views || 0)} {staticIndexData.common.viewsText}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    </div>
  );
};

export default NewsList;