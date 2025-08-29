import NewsCard from "./NewsCard";
import CategoryTabs from "./CategoryTabs";
import DateFilter from "./DateFilter";
import { useState, useMemo, useEffect, useRef } from "react";
import { Eye, MessageSquare, Clock, Flame, Loader2 } from "lucide-react";

// 使用MongoDB API获取数据
import { useMongoDBData } from '@/hooks/useMongoDBData';
// 导入工具函数
import { formatDateToChinese, generateIncrementedViews } from '@/lib/utils';

const NewsList = () => {
  // 使用MongoDB API获取新闻数据和分类数据
  const { data: newsData, loading: newsLoading, error: newsError } = useMongoDBData<any[]>('news');
  const { data: categoryData, loading: categoryLoading, error: categoryError } = useMongoDBData<any>('categories');
  const { data: indexData } = useMongoDBData<any>('index');
  
  // 从分类数据中获取所有分类名称
  const categories = useMemo(() => {
    if (!categoryData) return [];
    // categories API直接返回分类数组，而不是包含newsCategories字段的对象
    return Array.isArray(categoryData) ? categoryData : [];
  }, [categoryData]);

  // 状态来跟踪当前选中的分类
  const [activeCategory, setActiveCategory] = useState("全部");
  // 状态来跟踪日期筛选 - 默认显示最近一周的新闻
  const [dateRange, setDateRange] = useState<{start: string | null, end: string | null}>({
    start: null,
    end: null
  });
  // 状态来跟踪日期范围按钮的显示文本
  const [dateRangeText, setDateRangeText] = useState<string>('最近一周');
  
  // 状态来跟踪懒加载
  const [visibleCount, setVisibleCount] = useState(3); // 初始显示3条新闻
  const [isLoading, setIsLoading] = useState(false); // 加载状态
  const [showBackToTop, setShowBackToTop] = useState(false); // 返回顶部按钮显示状态
  const loaderRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 过滤和排序新闻数据
  const filteredNews = useMemo(() => {
    if (!newsData) return [];
    
    let result = [...newsData];
    
    // 按分类筛选
    if (activeCategory && activeCategory !== '全部') {
      result = result.filter(news => news.category?.cn === activeCategory);
    }
    
    // 按日期范围筛选
    if (dateRange.start || dateRange.end) {
      const startDate = dateRange.start ? new Date(dateRange.start).getTime() : null;
      const endDate = dateRange.end ? new Date(dateRange.end).getTime() + 86399999 : null; // 包含当天最后一刻
      
      result = result.filter(news => {
        const newsTime = new Date(news.publishTime).getTime();
        
        // 处理开始日期筛选
        if (startDate && newsTime < startDate) {
          return false;
        }
        
        // 处理结束日期筛选（包含当天）
        if (endDate && newsTime > endDate) {
          return false;
        }
        
        return true;
      });
    }
    
    // 确保新闻按日期降序排列
    result.sort((a, b) => new Date(b.publishTime).getTime() - new Date(a.publishTime).getTime());
    
    return result;
  }, [newsData, activeCategory, dateRange.start, dateRange.end]);
  
  // 处理懒加载的可见新闻
  const visibleNews = useMemo(() => {
    if (filteredNews.length === 0) return {};
    
    const result: Record<string, typeof filteredNews> = {};
    let count = 0;
    
    // 直接遍历已排序的新闻，按日期分组直到达到可见数量
    for (const news of filteredNews) {
      if (count >= visibleCount) break;
      
      const newsDate = new Date(news.publishTime).toISOString().split('T')[0];
      
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

  // 热门新闻数据 - 从API获取热门新闻
  const hotNews = useMemo(() => {
    if (!newsData) return [];
    return newsData.slice(0, 10); // API已经按热度排序
  }, [newsData]);
  
  // 当分类或日期范围改变时，重置可见数量
  useEffect(() => {
    setVisibleCount(3);
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
        <span className="text-xs leading-tight hidden md:block">{indexData?.common?.backToTopText || '返回顶部'}</span>
      </button>
      
      {/* 新闻列表内容 */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* 主新闻列表 - 移动端全宽，桌面端70%宽度 */}
          <div className="w-full lg:w-9/12">
            {Object.entries(visibleNews).map(([date, newsItems]) => {
              const [year, month, day] = date.split('-');
              const monthDay = indexData?.common?.dateFormat
                ?.replace('{month}', month || '')
                ?.replace('{day}', day || '')
                ?.replace('{weekday}', '') || `${month || ''}月${day || ''}日`;
              
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
                          title={news.title?.cn || ''}
                          summary={news.summary?.cn || ''}
                          category={news.category?.cn || ''}
                          publishTime={news.publishTime}
                          views={news.views}
                          isBreaking={news.isBreaking}
                          tags={news.tags?.cn || []}
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
                  <div key={`hot-news-${news.id}-${index}`} className="flex space-x-3 items-start">
                    {/* 火焰图标和排名数字 */}
                    <div className="flex flex-col items-center space-y-1">
                      <span className="text-xs font-bold text-gray-500 bg-red-500 w-5 h-5 flex text-white items-center justify-center">{index + 1}</span>
                    </div>
                    {/* 新闻内容 */}
                    <div className="flex-1">
                      <h4 className="text-sm font-medium hover:text-primary transition-colors cursor-pointer">
                        {news.title?.cn || ''}
                      </h4>
                      <div className="flex items-center mt-1 text-xs text-gray-500 space-x-2">
                        <span>{formatDateToChinese(news.publishTime || '')}</span>
                        <span>•</span>
                        <span>{generateIncrementedViews(news.views || 0)} {indexData?.common?.viewsText || '浏览'}</span>
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