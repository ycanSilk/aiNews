import React, { useState, useEffect, useRef, useContext } from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LanguageContext from "@/contexts/LanguageContext";
import timelineConfig from "@/data/ch/timeLine.json";
import './Timeline.css';

export interface NewsItem {
  date: string;
  title: string;
  content: string;
  important: boolean;
  tags: string[];
  url: string;
}

interface TimelineProps {
  initialNewsItems?: NewsItem[];
  defaultSearchTerm?: string;
  hotSearchTags?: string[];
  title?: string;
  subtitle?: string;
}

interface SearchBoxProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onSearch: () => void;
  hotSearchTags: string[];
}

interface FilterButtonsProps {
  activeFilter: string;
  onFilterClick: (filter: string) => void;
}

interface TimelineItemProps {
  item: NewsItem;
  index: number;
}

interface LoadMoreButtonProps {
  isLoading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({ searchTerm, onSearchChange, onSearch, hotSearchTags }) => (
  <div className="search-box">
    <div className="search-input-group">
      <input 
        type="text" 
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && onSearch()}
        placeholder={timelineConfig.defaultConfig.uiTexts.searchPlaceholder}
        className="search-input"
      />
      <button onClick={onSearch} className="search-btn">
        <i className={timelineConfig.defaultConfig.searchIcon}></i>
      </button>
    </div>
    <div className="hot-search-tags">
      <span>{timelineConfig.defaultConfig.uiTexts.hotSearchLabel}</span>
      {hotSearchTags.map((tag, index) => (
        <span 
          key={index} 
          className="hot-tag"
          onClick={() => {
            onSearchChange(tag);
            onSearch();
          }}
        >
          {tag}
        </span>
      ))}
    </div>
  </div>
);

const FilterButtons: React.FC<FilterButtonsProps> = ({ activeFilter, onFilterClick }) => (
  <div className="filters">
    <button 
      className={`filter-btn ${activeFilter === "all" ? "active" : ""}`}
      onClick={() => onFilterClick("all")}
    >
      <i className={timelineConfig.defaultConfig.filterIcons.all}></i> {timelineConfig.defaultConfig.uiTexts.filters.all}
    </button>
    <button 
      className={`filter-btn ${activeFilter === "important" ? "active" : ""}`}
      onClick={() => onFilterClick("important")}
    >
      <i className={timelineConfig.defaultConfig.filterIcons.important}></i> {timelineConfig.defaultConfig.uiTexts.filters.important}
    </button>
    <button 
      className={`filter-btn ${activeFilter === "product" ? "active" : ""}`}
      onClick={() => onFilterClick("product")}
    >
      <i className={timelineConfig.defaultConfig.filterIcons.product}></i> {timelineConfig.defaultConfig.uiTexts.filters.product}
    </button>
    <button 
      className={`filter-btn ${activeFilter === "research" ? "active" : ""}`}
      onClick={() => onFilterClick("research")}
    >
      <i className={timelineConfig.defaultConfig.filterIcons.research}></i> {timelineConfig.defaultConfig.uiTexts.filters.research}
    </button>
  </div>
);

const TimelineItemComponent: React.FC<TimelineItemProps> = ({ item, index }) => (
  <div 
    key={index} 
    className={`timeline-item ${item.important ? "important" : ""}`}
  >
    <div className="timeline-circle"></div>
    <div className="timeline-content">
      <div className="date">
        <i className={timelineConfig.defaultConfig.calendarIcon}></i>
        {item.date}
      </div>
      <h2>{item.title}</h2>
      <p>{item.content}</p>
      <div className="tags">
        {item.tags.map((tag, tagIndex) => (
          <span key={tagIndex} className="tag">
            {tag}
          </span>
        ))}
      </div>
      <a href={item.url} className="read-more mt-5">
        {timelineConfig.defaultConfig.uiTexts.readMore} <i className={timelineConfig.defaultConfig.arrowIcon}></i>
      </a>
    </div>
  </div>
);

const LoadMoreButton: React.FC<LoadMoreButtonProps> = ({ isLoading, hasMore, onLoadMore }) => (
  hasMore && (
    <div className="loading" id="loading">
      <button onClick={onLoadMore} disabled={isLoading}>
        {isLoading ? (
          <><i className={timelineConfig.defaultConfig.spinnerIcon}></i> {timelineConfig.defaultConfig.uiTexts.loading}</>
        ) : (
          <><i className={timelineConfig.defaultConfig.plusIcon}></i> {timelineConfig.defaultConfig.uiTexts.loadMore}</>
        )}
      </button>
    </div>
  )
);

const Timeline: React.FC<TimelineProps> = ({
  initialNewsItems,
  defaultSearchTerm,
  hotSearchTags,
  title,
  subtitle
}) => {
  const languageContext = useContext(LanguageContext);
  const currentLanguage = languageContext?.currentLanguage || 'ch';
  
  // 根据语言加载对应的配置文件
  const [timelineConfig, setTimelineConfig] = useState<any>(null);
  
  useEffect(() => {
    const loadConfig = async () => {
      const config = currentLanguage === 'en' 
        ? await import('@/data/en/timeLine.json')
        : await import('@/data/ch/timeLine.json');
      setTimelineConfig(config);
    };
    loadConfig();
  }, [currentLanguage]);
  
  // 设置默认值
  if (!timelineConfig) {
    return <div>Loading...</div>;
  }
  
  const finalInitialNewsItems = initialNewsItems || timelineConfig.defaultConfig.initialNewsItems || [];
  const finalDefaultSearchTerm = defaultSearchTerm || timelineConfig.defaultConfig.defaultSearchTerm || "OpenAI";
  const finalHotSearchTags = hotSearchTags || timelineConfig.defaultConfig.hotSearchTags || [];
  const finalTitle = title || timelineConfig.defaultConfig.title || "时间轴新闻";
  const finalSubtitle = subtitle || timelineConfig.defaultConfig.subtitle || "探索OpenAI发展历程中的重要里程碑";
  const [newsItems, setNewsItems] = useState<NewsItem[]>(finalInitialNewsItems); 

  const [searchTerm, setSearchTerm] = useState(finalDefaultSearchTerm);
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
        <header className="timelin-header">
          <h1 className='mb-5 text-3xl font-bold'><i className={timelineConfig.defaultConfig.newspaperIcon}></i> {finalTitle}</h1>
          <p className="subtitle">{finalSubtitle}</p>
          <SearchBox 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onSearch={handleSearch}
            hotSearchTags={finalHotSearchTags}
          />
        </header>
        
        <div className="news-count">
          {timelineConfig.defaultConfig.uiTexts.newsCount.replace('{count}', displayedItems.length.toString())}
        </div>
        
        <FilterButtons 
          activeFilter={activeFilter}
          handleFilterClick={handleFilterClick}
        />
        
        <div className="timeline" ref={timelineRef}>
          {displayedItems.map((item, index) => (
            <TimelineItemComponent 
              key={index}
              item={item}
              index={index}
            />
          ))}
        </div>
        
        {visibleItems < filteredItems.length && (
          <LoadMoreButton 
            isLoading={isLoading}
            handleLoadMore={handleLoadMore}
          />
        )}
      </div>  
      <Footer />
    </div>
  );
};

export default Timeline;