import React, { useState, useEffect, useRef } from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import './Timeline.css';

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
      date: "2025-08-25",
      title: "ChatGPT推出团队协作功能，支持实时多人编辑",
      content: "OpenAI为ChatGPT推出了全新的团队协作功能，允许用户共享对话、共同编辑提示词和协作创建内容。这一功能旨在提高团队生产力，使多人能够共同利用AI助手完成复杂任务。",
      important: false,
      tags: ["产品更新", "协作", "ChatGPT"],
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
        <header className="timelin-header">
          <h1 className='mb-5 text-3xl font-bold'><i className="fas fa-newspaper"></i> 时间轴新闻</h1>
          <p className="subtitle">探索 OpenAI 发展历程中的重要里程碑</p>
          <div className="search-box">
          <div className="search-input-group">
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="输入关键词搜索..."
              className="search-input"
            />
            <button onClick={handleSearch} className="search-btn">
              <i className="fas fa-search"></i>
            </button>
          </div>
          <div className="hot-search-tags">
            <span>热门搜索：</span>
            {['OpenAI', 'GPT-5','DeepSeek','Claude','Gemini','Grok','Qwen3','Kimi', 'AI', '大模型', '智能体'].map((tag, index) => (
              <span 
                key={index} 
                className="hot-tag"
                onClick={() => {
                  setSearchTerm(tag);
                  handleSearch();
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        </header>
        
        <div className="news-count">
          显示 {displayedItems.length} 条新闻
        </div>
        
        <div className="filters">
          <button 
            className={`filter-btn ${activeFilter === "all" ? "active" : ""}`}
            onClick={() => handleFilterClick("all")}
          >
            <i className="fas fa-layer-group"></i> 全部
          </button>
          <button 
            className={`filter-btn ${activeFilter === "important" ? "active" : ""}`}
            onClick={() => handleFilterClick("important")}
          >
            <i className="fas fa-star"></i> 关键节点
          </button>
          <button 
            className={`filter-btn ${activeFilter === "product" ? "active" : ""}`}
            onClick={() => handleFilterClick("product")}
          >
            <i className="fas fa-cube"></i> 产品发布
          </button>
          <button 
            className={`filter-btn ${activeFilter === "research" ? "active" : ""}`}
            onClick={() => handleFilterClick("research")}
          >
            <i className="fas fa-flask"></i> 研究突破
          </button>
        </div>
        
        <div className="timeline" ref={timelineRef}>
          {displayedItems.map((item, index) => (
            <div 
              key={index} 
              className={`timeline-item ${item.important ? "important" : ""}`}
            >
              <div className="timeline-circle"></div>
              <div className="timeline-content">
                <div className="date">
                  <i className="fas fa-calendar-alt"></i>
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
                  阅读更多 <i className="fas fa-arrow-right"></i>
                </a>
              </div>
            </div>
          ))}
        </div>
        
        {visibleItems < filteredItems.length && (
          <div className="loading" id="loading">
            <button onClick={handleLoadMore} disabled={isLoading}>
              {isLoading ? (
                <><i className="fas fa-spinner fa-spin"></i> 加载中...</>
              ) : (
                <><i className="fas fa-plus"></i> 加载更多新闻</>
              )}
            </button>
          </div>
        )}
      </div>  
      <Footer />
    </div>
  );
};

export default Timeline;