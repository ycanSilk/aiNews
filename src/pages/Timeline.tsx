import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import newsData from '../data/newsData.json';
import './Timeline.css';

interface NewsItem {
  id: number;
  title: string;
  summary: string;
  publishTime: string;
  date: string;
  weekday: string;
  views: number;
  comments: number;
  tags?: string[];
  important?: boolean;
  readTime?: string;
  category?: string;
}

const Timeline: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // 提取所有标签
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    newsData.forEach((news: NewsItem) => {
      if (news.tags) {
        news.tags.forEach(tag => tags.add(tag));
      }
    });
    return Array.from(tags);
  }, []);

  // 判断是否为关键节点新闻
  const isKeyEvent = (news: NewsItem): boolean => {
    return news.important || 
           (news.tags && news.tags.includes('OpenAI')) ||
           news.title.toLowerCase().includes('openai') ||
           news.summary.toLowerCase().includes('openai');
  };

  // 过滤和排序新闻
  const filteredNews = useMemo(() => {
    return newsData
      .filter((news: NewsItem) => {
        // 关键词搜索
        const matchesSearch = searchTerm === '' || 
          news.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          news.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (news.tags && news.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));

        // 过滤器筛选
        const matchesFilter = selectedFilter === 'all' || 
          (selectedFilter === 'important' && isKeyEvent(news)) ||
          (selectedFilter === 'AI' && news.tags && news.tags.includes('AI')) ||
          (selectedFilter === 'product' && news.tags && news.tags.includes('产品发布')) ||
          (selectedFilter === 'research' && news.tags && news.tags.includes('研究'));

        // 标签筛选
        const matchesTag = !selectedTag || (news.tags && news.tags.includes(selectedTag));

        return matchesSearch && matchesFilter && matchesTag;
      })
      .sort((a: NewsItem, b: NewsItem) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [searchTerm, selectedFilter, selectedTag]);

  // 按日期分组
  const groupedNews = useMemo(() => {
    const groups: { [key: string]: NewsItem[] } = {};
    filteredNews.forEach((news: NewsItem) => {
      const dateKey = news.date;
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(news);
    });
    return groups;
  }, [filteredNews]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm) {
      setSearchParams({ q: searchTerm });
    } else {
      setSearchParams({});
    }
  };

  const handleFilterClick = (filter: string) => {
    setSelectedFilter(filter);
    setSelectedTag(null);
  };

  const handleTagClick = (tag: string) => {
    setSelectedTag(tag === selectedTag ? null : tag);
    setSelectedFilter('all');
  };

  return (
    <div className="timeline-container">
      <header className="timeline-header">
        <h1 className="timeline-title"><i className="fas fa-newspaper"></i> 时间轴新闻</h1>
        <p className="timeline-subtitle">探索 AI 发展历程中的重要里程碑</p>
        <form className="timeline-search-box" onSubmit={handleSearch}>
          <input
            type="text"
            className="timeline-search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="输入关键词搜索..."
          />
          <button type="submit" className="timeline-search-button"><i className="fas fa-search"></i> 搜索</button>
        </form>
      </header>

      <div className="timeline-news-count">
        显示 {filteredNews.length} 条新闻{searchTerm && ` - 搜索: "${searchTerm}"`}
        {selectedTag && ` - 标签: "${selectedTag}"`}
        {selectedFilter !== 'all' && ` - 筛选: "${selectedFilter}"`}
      </div>

      <div className="timeline-filters">
        <button
          className={`timeline-filter-btn ${selectedFilter === 'all' ? 'active' : ''}`}
          onClick={() => handleFilterClick('all')}
        >
          <i className="fas fa-layer-group"></i> 全部
        </button>
        <button
          className={`timeline-filter-btn ${selectedFilter === 'important' ? 'active' : ''}`}
          onClick={() => handleFilterClick('important')}
        >
          <i className="fas fa-star"></i> 重点新闻
        </button>
        <button
          className={`timeline-filter-btn ${selectedFilter === 'AI' ? 'active' : ''}`}
          onClick={() => handleFilterClick('AI')}
        >
          <i className="fas fa-robot"></i> AI相关
        </button>
        <button
          className={`timeline-filter-btn ${selectedFilter === 'product' ? 'active' : ''}`}
          onClick={() => handleFilterClick('product')}
        >
          <i className="fas fa-cube"></i> 产品发布
        </button>
        <button
          className={`timeline-filter-btn ${selectedFilter === 'research' ? 'active' : ''}`}
          onClick={() => handleFilterClick('research')}
        >
          <i className="fas fa-flask"></i> 研究突破
        </button>
      </div>

      {allTags.length > 0 && (
        <div className="timeline-filters">
          <span style={{ marginRight: '10px', fontWeight: 'bold' }}>热门标签:</span>
          {allTags.slice(0, 10).map((tag) => (
            <button
              key={tag}
              className={`timeline-filter-btn ${selectedTag === tag ? 'active' : ''}`}
              onClick={() => handleTagClick(tag)}
              style={{ fontSize: '0.8rem', padding: '4px 8px' }}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      <div className="timeline-wrapper">
        {Object.entries(groupedNews).map(([date, newsItems]) => (
          <div key={date}>
            {newsItems.map((news: NewsItem, index: number) => {
              const isImportant = isKeyEvent(news);
              return (
                <div
                  key={news.id}
                  className={`timeline-item ${isImportant ? 'important' : ''}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="timeline-circle"></div>
                  <div className="timeline-content">
                    <div className="timeline-date">
                      <i className="fas fa-calendar"></i>
                      {news.date} {news.weekday && `(${news.weekday})`}
                      {isImportant && <i className="fas fa-star" style={{ marginLeft: '8px', color: 'var(--highlight-color)' }}></i>}
                    </div>
                    <h3>{news.title}</h3>
                    <p>{news.summary}</p>
                    
                    {news.tags && news.tags.length > 0 && (
                      <div className="timeline-tags">
                        {news.tags.map((tag) => (
                          <span
                            key={tag}
                            className="timeline-tag"
                            onClick={() => handleTagClick(tag)}
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    <div style={{ marginTop: '15px', fontSize: '0.9rem', color: 'var(--light-text)' }}>
                      <span><i className="fas fa-eye"></i> {news.views}次浏览</span>
                      <span style={{ marginLeft: '15px' }}><i className="fas fa-comment"></i> {news.comments}条评论</span>
                      {news.readTime && (
                        <span style={{ marginLeft: '15px' }}><i className="fas fa-clock"></i> {news.readTime}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {filteredNews.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--light-text)' }}>
          <i className="fas fa-search" style={{ fontSize: '3rem', marginBottom: '20px' }}></i>
          <h3>未找到相关新闻</h3>
          <p>请尝试不同的搜索词或筛选条件</p>
        </div>
      )}

      <div className="timeline-footer">
        <p>© 2025 时间轴新闻 - 为您呈现科技发展的重要时刻</p>
      </div>
    </div>
  );
};

export default Timeline;