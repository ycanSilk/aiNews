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

  // 静态数据初始化
  useEffect(() => {
    // 默认静态新闻数据
    const defaultNewsItems: NewsItem[] = [
      {
        date: "2024-01-15",
        title: "OpenAI releases GPT-4 Turbo with improved capabilities",
        content: "OpenAI has launched GPT-4 Turbo, featuring enhanced reasoning, better memory, and improved multimodal understanding.",
        important: true,
        tags: ["AI", "产品更新"],
        url: "#"
      },
      {
        date: "2024-01-10",
        title: "Google DeepMind develops new AI model for scientific discovery",
        content: "Google's DeepMind team has created an AI system that can accelerate scientific research in various fields including medicine and materials science.",
        important: false,
        tags: ["AI", "研究"],
        url: "#"
      },
      {
        date: "2024-01-05",
        title: "Microsoft integrates AI Copilot across Office suite",
        content: "Microsoft has fully integrated its AI Copilot feature into all Office applications, providing AI-assisted writing, data analysis, and presentation creation.",
        important: true,
        tags: ["AI", "产品更新"],
        url: "#"
      },
      {
        date: "2023-12-20",
        title: "New breakthrough in quantum computing with AI assistance",
        content: "Researchers have used AI algorithms to optimize quantum computing processes, achieving significant improvements in computational efficiency.",
        important: false,
        tags: ["AI", "研究"],
        url: "#"
      },
      {
        date: "2023-12-15",
        title: "Tesla unveils new AI-powered autonomous driving features",
        content: "Tesla has released version 12 of its Full Self-Driving software with enhanced AI capabilities for better road navigation and safety.",
        important: true,
        tags: ["AI", "产品更新"],
        url: "#"
      },
      {
        date: "2023-12-10",
        title: "AI helps discover new antibiotic compounds",
        content: "Artificial intelligence has been used to identify promising new antibiotic candidates that could combat drug-resistant bacteria.",
        important: false,
        tags: ["AI", "研究"],
        url: "#"
      },
      {
        date: "2023-12-05",
        title: "Amazon launches AI-powered shopping assistant",
        content: "Amazon has introduced a new AI shopping assistant that provides personalized product recommendations and shopping guidance.",
        important: true,
        tags: ["AI", "产品更新"],
        url: "#"
      },
      {
        date: "2023-11-28",
        title: "AI model achieves human-level performance in medical diagnosis",
        content: "A new AI system has demonstrated diagnostic accuracy comparable to experienced medical professionals in multiple medical specialties.",
        important: true,
        tags: ["AI", "研究"],
        url: "#"
      }
    ];
    
    setNewsItems(defaultNewsItems);
  }, []);

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