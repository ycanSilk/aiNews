import React, { useState, useEffect, useRef } from 'react';
import TimelineHeader from '@/components/timeline/TimelineHeader';
import SearchBox from '@/components/timeline/SearchBox';
import FilterButtons from '@/components/timeline/FilterButtons';
import TimelineItem from '@/components/timeline/TimelineItem';
import NewsCount from '@/components/timeline/NewsCount';
import LoadMoreButton from '@/components/timeline/LoadMoreButton';
import { useMongoDBData } from '@/hooks/useMongoDBData';
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface NewsItem {
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
  // 使用MongoDB API获取新闻数据
  const { data: newsData, loading: newsLoading } = useMongoDBData<any[]>('timeline');
  
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [searchTerm, setSearchTerm] = useState(config.defaultSearchTerm || "OpenAI");
  const [activeFilter, setActiveFilter] = useState("all");
  const [visibleItems, setVisibleItems] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const timelineRef = useRef<HTMLDivElement>(null);

  // 数据加载完成后设置初始状态
  useEffect(() => {
    if (!newsLoading) {
      setNewsItems(newsData || []);
    }
  }, [newsLoading, newsData]);

  const filteredItems = newsItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.content.toLowerCase().includes(searchTerm.toLowerCase());
    
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

  if (newsLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='mb-20'>
      <Header />
        <div className='container'>
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