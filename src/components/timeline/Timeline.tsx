import React, { useState, useEffect, useRef } from 'react';
import TimelineHeader from '@/components/timeline/TimelineHeader';
import SearchBox from '@/components/timeline/SearchBox';
import FilterButtons from '@/components/timeline/FilterButtons';
import TimelineItem from '@/components/timeline/TimelineItem';
import NewsCount from '@/components/timeline/NewsCount';
import LoadMoreButton from '@/components/timeline/LoadMoreButton';
import Header from "@/components/Header";
import Footer from "@/components/Footer";


interface NewsItem {
  id: string;
  date: string;
  title: string;
  content: string;
  important: boolean;
  tags: string[];
  url: string;
}

interface TimelineConfig {
  title: string;
  subtitle: string;
  defaultSearchTerm: string;
  hotSearchTags: string[];
  uiTexts: {
    searchPlaceholder: string;
    hotSearchLabel: string;
    filters: {
      all: string;
      important: string;
      product: string;
      research: string;
    };
    newsCount: string;
    loading: string;
    loadMore: string;
    readMore: string;
  };
}

interface TimelineProps {
  config: TimelineConfig;
  language: string;
}

const Timeline: React.FC<TimelineProps> = ({ config, language }) => {
  // 静态数据模式 - 数据库功能已禁用
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [searchTerm, setSearchTerm] = useState(config.defaultSearchTerm || "OpenAI");
  const [activeFilter, setActiveFilter] = useState("all");
  const [visibleItems, setVisibleItems] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const timelineRef = useRef<HTMLDivElement>(null);

  // 从news.json加载真实数据
  useEffect(() => {
    const loadNewsData = async () => {
      try {
        const response = await fetch('/databases/news.json');
        const newsData = await response.json();
        
        const realNewsItems: NewsItem[] = newsData.map((news: any) => ({
          id: news.id,
          date: news.publishedAt.split(' ')[0], // 只取日期部分
          title: news.title,
          content: news.content,
          important: news.views > 1500, // 浏览量超过1500的标记为重要
          tags: news.tags,
          url: news.externalUrl || "#"
        }));
        
        // 按日期降序排序
        realNewsItems.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
        setNewsItems(realNewsItems);
      } catch (error) {
        console.error('加载新闻数据失败:', error);
      }
    };
    
    loadNewsData();
  }, []);

  const filteredItems = newsItems.filter(item => {
    const searchTermLower = searchTerm.toLowerCase();
    const matchesSearch = item.title.toLowerCase().includes(searchTermLower) ||
                         item.content.toLowerCase().includes(searchTermLower) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchTermLower));
    
    const matchesFilter = activeFilter === "all" ||
                         (activeFilter === "important" && item.important) ||
                         (activeFilter === "AI" && item.tags.includes("AI")) ||
                         (activeFilter === "product" && item.tags.includes("产品更新")) ||
                         (activeFilter === "research" && item.tags.includes("研究"));
    
    return matchesSearch && matchesFilter;
  });

  const displayedItems = filteredItems.slice(0, visibleItems);

  const handleSearch = () => {
    setVisibleItems(10);
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 500);
  };

  const handleFilterClick = (filter: string) => {
    setActiveFilter(filter);
    setVisibleItems(10);
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 500);
  };

  const handleLoadMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      setVisibleItems(prev => prev + 10);
      setIsLoading(false);
    }, 1000);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    const items = timelineRef.current?.querySelectorAll('.timeline-item');
    items?.forEach(item => observer.observe(item));

    return () => observer.disconnect();
  }, [displayedItems]);

  if (false) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Header />
        <div className='container mb-10'>
          <TimelineHeader 
        title={config.title}
        subtitle={config.subtitle}
      >
        <SearchBox 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onSearch={handleSearch}
          placeholder={config.uiTexts?.searchPlaceholder}
          hotSearchTags={config.hotSearchTags}
          hotSearchLabel={config.uiTexts?.hotSearchLabel}
        />
      </TimelineHeader>
      
      <NewsCount 
        count={displayedItems.length}
        textTemplate={config.uiTexts?.newsCount}
      />
      
      <FilterButtons 
        activeFilter={activeFilter}
        onFilterClick={handleFilterClick}
        filters={config.uiTexts?.filters}
      />
      
      <div className="timeline" ref={timelineRef}>
        {displayedItems.map((item, index) => (
          <TimelineItem 
            key={index}
            item={item}
            index={index}
            readMoreText={config.uiTexts?.readMore}
          />
        ))}
      </div>
      
      <LoadMoreButton 
        isLoading={isLoading}
        hasMore={visibleItems < filteredItems.length}
        onLoadMore={handleLoadMore}
        loadingText={config.uiTexts?.loading}
        loadMoreText={config.uiTexts?.loadMore}
      />
        </div>
      <Footer />
    </div>
  );
};

export default Timeline;