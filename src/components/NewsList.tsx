import NewsCard from "./NewsCard";
import CategoryTabs from "./CategoryTabs";
import DateFilter from "./DateFilter";
import { useState, useMemo, useEffect, useRef } from "react";
import { Eye, MessageSquare, Clock, Flame, Loader2 } from "lucide-react";

// 从外部JSON文件导入新闻数据
import newsData from '../data/newsData.json';

const NewsList = () => {
  // 从新闻数据中提取所有唯一的分类
  const categories = useMemo(() => {
    const uniqueCategories = new Set(newsData.map(news => news.category));
    return Array.from(uniqueCategories);
  }, []);

  // 状态来跟踪当前选中的分类
  const [activeCategory, setActiveCategory] = useState("全部");
  // 状态来跟踪日期筛选
  const [dateRange, setDateRange] = useState<{start: string | null, end: string | null}>({
    start: null,
    end: null
  });
  
  // 状态来跟踪懒加载
  const [visibleCount, setVisibleCount] = useState(3); // 初始显示3条新闻
  const [isLoading, setIsLoading] = useState(false); // 加载状态
  const loaderRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 根据选中的分类和日期范围过滤新闻数据
  const filteredNews = useMemo(() => {
    let result = [...newsData];
    
    // 按分类过滤
    if (activeCategory !== "全部") {
      result = result.filter(news => news.category === activeCategory);
      if (process.env.NODE_ENV === 'development') {
        console.log(`[调试] 按分类"${activeCategory}"过滤后，新闻数量: ${result.length}`);
      }
    } else if (process.env.NODE_ENV === 'development') {
      console.log(`[调试] 选择全部分类，新闻数量: ${result.length}`);
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
        
        const isWithinRange = newsDate >= startDate && newsDate <= endDate;
        if (process.env.NODE_ENV === 'development' && !isWithinRange) {
          console.log(`[调试] 新闻${news.id}(${news.date})不在日期范围内(${dateRange.start}至${dateRange.end})`);
        }
        return isWithinRange;
      });
      if (process.env.NODE_ENV === 'development') {
        console.log(`[调试] 按日期范围${dateRange.start}至${dateRange.end}过滤后，新闻数量: ${result.length} (过滤掉${originalLength - result.length}条)`);
      }
    }
    
    // 确保新闻按日期降序排列
    result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`[调试] 最终过滤结果: ${result.length}条新闻`);
      if (result.length > 0) {
        console.log(`[调试] 日期分布: ${result.map(n => n.date).join(', ')}`);
      }
    }
    
    return result;
  }, [activeCategory, dateRange]);
  
  // 处理懒加载的可见新闻
  const visibleNews = useMemo(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[调试] 计算可见新闻: visibleCount=${visibleCount}, filteredNews.length=${filteredNews.length}`);
    }
    
    // 如果没有过滤后的新闻，返回空对象
    if (filteredNews.length === 0) {
      if (process.env.NODE_ENV === 'development') {
        console.log(`[调试] 没有过滤后的新闻，返回空对象`);
      }
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
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`[调试] 按日期分组结果: ${Object.entries(grouped).map(([date, news]) => `${date}: ${news.length}条`).join(', ')}`);
    }
    
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
    
    if (process.env.NODE_ENV === 'development') {
      const totalVisible = Object.values(result).reduce((sum, news) => sum + news.length, 0);
      console.log(`[调试] 可见新闻计算结果: ${Object.keys(result).length}个日期组，共${totalVisible}条新闻`);
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
    if (process.env.NODE_ENV === 'development') {
      console.log(`[调试] 日期范围变化: start=${startDate}, end=${endDate}`);
    }
    
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
      if (process.env.NODE_ENV === 'development') {
        console.log(`[调试] 检测到未来日期，自动调整为今天: ${todayStr}`);
      }
    }
    
    // 确保开始日期不晚于结束日期
    if (validStartDate && validEndDate && new Date(validStartDate) > new Date(validEndDate)) {
      validStartDate = validEndDate;
      if (process.env.NODE_ENV === 'development') {
        console.log(`[调试] 开始日期晚于结束日期，自动调整为相同日期: ${validEndDate}`);
      }
    }
    
    setDateRange({ start: validStartDate, end: validEndDate });
  };

  // 热门新闻数据
  const hotNews = newsData.filter(news => news.views > 800).slice(0, 5);
  
  // 当分类或日期范围改变时，重置可见数量
  useEffect(() => {
    setVisibleCount(3);
  }, [activeCategory, dateRange]);
  
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
    }, 1000);
  };
  
  // 监听滚动事件，实现无限滚动
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
    };
    
    // 监听窗口滚动事件
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isLoading, visibleCount, filteredNews.length, showNoResultsMessage, loadMoreNews]);

  return (
    <section className="bg-news-background">
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
      
      {/* 新闻列表内容 */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* 主新闻列表 - 70%宽度 */}
          <div className="lg:w-9/12">
            {Object.entries(visibleNews).map(([date, newsItems]) => {
              const firstNews = newsItems[0];
              const monthDay = date.slice(5).replace('-', '月') + '日';
              
              // 使用日期和新闻项数量的组合作为key，确保唯一性
              const uniqueKey = `${date}-${newsItems.length}`;
              
              return (
                <div key={uniqueKey} className="mb-8">
                  {/* 日期分组标题栏 */}
                  <div className="mb-4 py-3 border-b-2 border-blue-500">
                    <div className="flex items-center">
                      <div className="w-1 h-8 bg-blue-500 mr-3"></div>
                      <h3 className="text-xl font-bold text-gray-800">
                        {monthDay}·{firstNews.weekday}
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
                  <p className="text-sm text-muted-foreground">加载中...</p>
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
                <p className="text-sm text-muted-foreground">已显示全部新闻</p>
              ) : null}
            </div>
            
            {/* 调试信息 - 仅用于开发环境 */}
            {process.env.NODE_ENV === 'development' && (
              <div className="text-xs text-gray-400 mt-2 text-center">
                已过滤: {filteredNews.length} 条新闻, 已显示: {visibleCount} 条
                {dateRange.start && dateRange.end && `, 日期范围: ${dateRange.start} 至 ${dateRange.end}`}
              </div>
            )}
          </div>

          {/* 热门新闻侧边栏 - 30%宽度 */}
          <div className="lg:w-3/12">
            <div className="bg-news-card rounded-none p-6 border border-border">
              <h3 className="text-xl font-bold text-foreground mb-6 flex items-center">
                <span className="w-6 h-6 rounded-full  flex items-center justify-center text-red-500 mr-3">
                    <Flame className="w-7 h-7" />
                </span>
                热门新闻
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
                        <span>{news.views} 浏览</span>
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