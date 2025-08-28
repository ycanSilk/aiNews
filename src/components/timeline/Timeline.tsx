import React, { useState, useEffect, useRef } from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SearchBox from './SearchBox';
import FilterButtons from './FilterButtons';
import TimelineItem from './TimelineItem';
import LoadMoreButton from './LoadMoreButton';
import NewsCount from './NewsCount';
import TimelineHeader from './TimelineHeader';


interface NewsItem {
  date: string;
  title: string;
  content: string;
  important: boolean;
  tags: string[];
  url: string;
}

const Timeline: React.FC = () => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([
    {
      date: "2025-08-28",
      title: "OpenAI宣布与微软深化合作，共同开发企业级AI解决方案",
      content: "OpenAI与微软宣布扩大战略合作伙伴关系，将共同开发新一代企业级AI解决方案。此次合作将结合OpenAI的先进AI技术和微软的云计算基础设施，为企业客户提供更强大的AI能力。",
      important: true,
      tags: ["合作", "企业AI", "微软"],
      url: "#"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("OpenAI");
  const [activeFilter, setActiveFilter] = useState("all");
  const [visibleItems, setVisibleItems] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const timelineRef = useRef<HTMLDivElement>(null);

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

  return (
        
    <div className="">
      <Header />
      <div className='container mb-20'>
        <TimelineHeader 
          title="时间轴新闻" 
          subtitle="探索 OpenAI 发展历程中的重要里程碑"
        >
          <SearchBox 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onSearch={handleSearch}
            hotSearchTags={['OpenAI', 'GPT-5','DeepSeek','Claude','Gemini','极速赛车开奖直播网Grok','Qwen3','Kimi', 'AI', '大模型', '智能体']}
          />
        </TimelineHeader>
        
        <NewsCount count={displayedItems.length} />
        
        <FilterButtons 
          activeFilter={activeFilter}
          onFilterClick={handleFilterClick}
        />
        
        <div className="timeline" ref={timelineRef}>
          {displayedItems.map((item, index) => (
            <TimelineItem 
              key={index}
              item={item}
              index={index}
            />
          ))}
        </div>
        
        <LoadMoreButton 
          isLoading={isLoading}
          hasMore={visibleItems < filteredItems.length}
          onLoadMore={handleLoadMore}
        />
      </div>  
      <Footer />
    </div>
  );
};

export default Timeline;