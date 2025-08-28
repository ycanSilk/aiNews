import NewsCard from "./NewsCard";
import CategoryTabs from "./CategoryTabs";
import DateFilter from "./DateFilter";
import { useState, useMemo, useEffect, useRef } from "react";
import { Eye, MessageSquare, Clock, Flame, Loader2 } from "lucide-react";

// 从外部JSON文件导入新闻数据和分类数据
import { useLanguageData } from '@/hooks/useLanguageData';

const NewsList = () => {
  // 使用语言数据钩子加载新闻数据和分类数据
  const { data: newsData, loading: newsLoading, error: newsError } = useLanguageData<any[]>('newsData.json');
  const { data: categoryData, loading: categoryLoading, error: categoryError } = useLanguageData<any>('categories.json');
  const { data: indexData } = useLanguageData<any>('index.json');
  
  // 从分类数据中获取所有分类名称
  const categories = useMemo(() => {
    if (!categoryData || !categoryData.newsCategories) return [];
    return categoryData.newsCategories.map((cat: any) => cat.name);
  }, [categoryData]);

  // 状态来跟踪当前选中的分类
  const [activeCategory, setActiveCategory] = useState("全部");
  // 状态来跟踪日期筛选 - 默认显示最近一周的新闻
  const [dateRange, setDateRange] = useState<{start: string | null, end: string | null}>({
    start: null,
    end: null
  });
  
  // 状态来跟踪懒加载
  const [visibleCount, setVisibleCount] = useState(3); // 初始显示3条新闻
  const [isLoading, setIsLoading] = useState(false); // 加载状态
  const [showBackToTop, setShowBackToTop] = useState(false); // 返回顶部按钮显示状态
  const loaderRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 根据选中的分类和日期范围过滤新闻数据
  const filteredNews = useMemo(() => {
    if (!newsData) {
      return [];
    }
    
    let result = [...newsData];
    
    // 按分类过滤
    if (activeCategory !== "全部") {
      // 对于新的AI分类，显示相关新闻（如果分类存在于新闻数据中）
      if (categories.includes(activeCategory)) {
        result = result.filter(news => news.category === activeCategory);
      } else {
        // 对于新的分类，暂时显示空结果或所有新闻
        result = [];
      }

    }
    
    // 按日期范围过滤
    if (dateRange.start && dateRange.end) {
      const originalLength = result.length;
      
      // 确保日期比较的正确性
      result = result.filter(news => {
        // 规范化日期格式，确保正确比较
        const newsDate = new Date(news.date);
        const startDate = new Date(dateRange.start!);
        const endDate = new Date(dateRange.end!);
        
        // 重置时间部分，仅比较日期
        newsDate.setHours(0, 0, 0, 0);
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
        
        return newsDate >= startDate && newsDate <= endDate;
      });
      

    }
    
    // 确保新闻按日期降序排列
    result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    

    
    return result;
  }, [activeCategory, dateRange]);
  
  // 处理懒加载的可见新闻
  const visibleNews = useMemo(() => {

    
    // 如果没有过滤后的新闻，返回空对象
    if (filteredNews.length === 0) {

      return {};
    }
    
    // 先按日期分组
    const grouped = filteredNews.reduce((acc, news) => {
      if (!acc[news.date]) {
        acc[news.date] = [];
      }
      acc[news.date].push(news);
      return acc;
    }, {} as Record<string, typeof filteredNews>);
    

    
    // 获取所有日期并排序（确保降序）
    const sortedDates = Object.keys(grouped).sort((a, b) => {
      const dateA = new Date(a);
      const dateB = new Date(b);
      return dateB.getTime() - dateA.getTime();
    });
    
    // 按日期分组并限制显示数量
    const result: Record<string, typeof filteredNews> = {};
    let count = 0;
    
    for (const date of sortedDates) {
      if (count >= visibleCount) break;
      
      const dateNews = grouped[date];
      const remainingSlots = visibleCount - count;
      
      if (remainingSlots >= dateNews.length) {
        // 全部显示
        result[date] = dateNews;
        count += dateNews.length;
      } else {
        // 部分显示
        result[date] = dateNews.slice(0, remainingSlots);
        count += remainingSlots;
      }
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
    
    // 验证日期范围有效性
    let validStartDate = startDate;
    let validEndDate = endDate;
    
    // 获取当前日期
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().split('T')[0];
    
    // 检查是否选择了未来日期
    if (endDate && new Date(endDate) > today) {
      validEndDate = todayStr;

    }
    
    // 确保开始日期不晚于结束日期
    if (validStartDate && validEndDate && new Date(validStartDate) > new Date(validEndDate)) {
      validStartDate = validEndDate;

    }
    
    setDateRange({ start: validStartDate, end: validEndDate });
  };

  // 热门新闻数据 - 固定显示10条，按阅读量和更新时间排序
  const hotNews = useMemo(() => {
    if (!newsData) return [];
    return newsData
      .sort((a: any, b: any) => {
        // 首先按阅读量降序排序
        if (b.views !== a.views) {
          return b.views - a.views;
        }
        // 如果阅读量相同，按更新时间降序排序
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      })
      .slice(0, 10);
  }, [newsData]);
  
  // 当分类或日期范围改变时，重置可见数量
  useEffect(() => {
    setVisibleCount(3);
  }, [activeCategory, dateRange]);

  // 组件挂载时，自动设置日期范围为新闻数据中的实际日期范围
  useEffect(() => {
    if (!newsData || newsData.length === 0) return;
    
    // 获取新闻数据中的所有日期
    const newsDates = newsData.map(news => new Date(news.date));
    const minDate = new Date(Math.min(...newsDates.map(d => d.getTime())));
    const maxDate = new Date(Math.max(...newsDates.map(d => d.getTime())));
    
    const formatDate = (date: Date) => {
      return date.toISOString().split('T')[0];
    };
    
    const startDate = formatDate(minDate);
    const endDate = formatDate(maxDate);
    

    
    setDateRange({
      start: startDate,
      end: endDate
    });
  }, [newsData]);
  
  // 加载更多新闻
  const loadMoreNews = () => {
    if (isLoading || visibleCount >= filteredNews.length) return;
    
    setIsLoading(true);
    
    // 2秒延迟
    setTimeout(() => {
      setVisibleCount(prevCount => {
        const newCount = Math.min(prevCount + 3, filteredNews.length);
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

  // 加载状态显示
  if (newsLoading || categoryLoading) {
    return (
      <section className="bg-news-background relative">
        <div className="container mx-auto px-4 py-12">
          <div className="flex justify-center">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <span className="ml-2">{indexData?.common?.loadingText || '加载中...'}</span>
            </div>
        </div>
      </section>
    );
  }

  // 错误状态显示
  if (newsError || categoryError) {
    return (
      <section className="bg-news-background relative">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center text-red-500">
            <p>{indexData?.common?.errorText || '加载数据时出错'}: {newsError || categoryError}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-news-background relative">
      {/* 分类标签切换组件 */}
      <CategoryTabs 
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />
      
      {/* 日期筛选组件 */}
      <div className="container mx-auto px-4 pt-6">
        <DateFilter onDateRangeChange={handleDateRangeChange} />
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
        <span className="text-xs leading-tight hidden md:block">{indexData?.common?.backToTopText || '返回顶部'}</span>
      </button>
      
      {/* 新闻列表内容 */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* 主新闻列表 - 移动端全宽，桌面端70%宽度 */}
          <div className="w-full lg:w-9/12">
            {Object.entries(visibleNews).map(([date, newsItems]) => {
              const firstNews = newsItems[0];
              const [year, month, day] = date.split('-');
              const monthDay = indexData?.common?.dateFormat
                ?.replace('{month}', month)
                ?.replace('{day}', day)
                ?.replace('{weekday}', firstNews.weekday) || `${month}月${day}日·${firstNews.weekday}`;
              
              // 使用日期和新闻项数量的组合作为key，确保唯一性
              const uniqueKey = `${date}-${newsItems.length}`;
              
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
                          summary={news.summary}
                          category={news.category}
                          readTime={news.readTime}
                          publishTime={news.publishTime}
                          views={news.views}
                          comments={news.comments}
                          isBreaking={news.isBreaking}
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
                  <p className="text-sm text-muted-foreground">{indexData?.common?.loadingText || '加载中...'}</p>
                </div>
              ) : hasFutureDateSelection ? (
                <p className="text-sm text-amber-500">
                  系统已自动调整日期范围至今天，当前暂无未来日期的新闻
                </p>
              ) : showNoResultsMessage ? (
                <p className="text-sm text-muted-foreground">
                  在所选日期范围内没有找到相关新闻
                  {dateRange.start && dateRange.end && (
                    <> ({
                      dateRange.start === dateRange.end 
                        ? dateRange.start 
                        : `${dateRange.start} 至 ${dateRange.end}`
                    }) </>
                  )}
                </p>
              ) : visibleCount >= filteredNews.length ? (
                <p className="text-sm text-muted-foreground">{indexData?.newsSection?.allNewsText || '已显示全部新闻'}</p>
              ) : null}
            </div>
            
            {/* 调试信息 - 仅用于开发环境 */}
            {process.env.NODE_ENV === 'development' && (
              <div className="text-xs text-gray-400 mt-2 text-center">
                {indexData?.newsSection?.filteredText?.replace('{filtered}', filteredNews.length.toString())?.replace('{visible}', visibleCount.toString()) || `已过滤: ${filteredNews.length} 条新闻, 已显示: ${visibleCount} 条`}
                {dateRange.start && dateRange.end && `, ${indexData?.newsSection?.dateRangeText || '日期范围'}: ${dateRange.start} ${indexData?.newsSection?.toText || '至'} ${dateRange.end}`}
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
                {indexData?.newsSection?.hotNewsTitle || '热门新闻'}
              </h3>
              
              <div className="space-y-6">
                {hotNews.map((news, index) => (
                  <div key={news.id} className="flex space-x-3 items-start">
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
                        <span>{news.publishTime}</span>
                        <span>•</span>
                        <span>{news.views} {indexData?.common?.viewsText || '浏览'}</span>
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
  );
};

export default NewsList;