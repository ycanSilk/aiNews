import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NewsCard from '@/components/NewsCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Calendar, Star, TrendingUp, Filter, Layers, Sparkles } from 'lucide-react';
import { useLanguageData } from '@/hooks/useLanguageData';
import { useLanguage } from '@/contexts/LanguageContext';
import './Timeline.css';

const Timeline = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const { data: newsData, loading, error } = useLanguageData<any[]>('newsData.json');
  const { data: indexData } = useLanguageData<any>('index.json');
  const { currentLanguage } = useLanguage();

  // 关键时间点标识函数
  const isKeyEvent = (news: any) => {
    const keyTerms = ['突破', '里程碑', '首次', '发布', '重大', '革命性', '突破性', 'GPT', 'OpenAI'];
    return keyTerms.some(term => 
      news.title.includes(term) || news.summary.includes(term)
    ) || news.views > 1000 || news.comments > 50 || news.isBreaking;
  };

  // 提取所有标签
  const allTags = useMemo(() => {
    if (!newsData) return [];
    const tags = new Set<string>();
    newsData.forEach(news => {
      if (news.tags) {
        news.tags.forEach((tag: string) => tags.add(tag));
      }
    });
    return Array.from(tags).sort();
  }, [newsData]);

  // 过滤和排序新闻
  const filteredNews = useMemo(() => {
    if (!newsData) return [];
    
    let filtered = newsData;
    
    // 关键词搜索
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(news => 
        news.title.toLowerCase().includes(term) ||
        news.summary.toLowerCase().includes(term) ||
        news.category.toLowerCase().includes(term) ||
        (news.tags && news.tags.some((tag: string) => tag.toLowerCase().includes(term)))
      );
    }
    
    // 标签筛选
    if (selectedTag) {
      filtered = filtered.filter(news => 
        news.tags && news.tags.includes(selectedTag)
      );
    }
    
    // 过滤器筛选
    if (activeFilter === 'keyEvents') {
      filtered = filtered.filter(isKeyEvent);
    } else if (activeFilter === 'openAI') {
      filtered = filtered.filter(news => 
        news.title.toLowerCase().includes('openai') ||
        news.summary.toLowerCase().includes('openai') ||
        (news.tags && news.tags.some((tag: string) => tag.toLowerCase().includes('openai')))
      );
    }
    
    // 按日期降序排序
    return filtered.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [newsData, searchTerm, activeFilter, selectedTag]);

  // 按日期分组
  const groupedNews = useMemo(() => {
    return filteredNews.reduce((acc, news) => {
      if (!acc[news.date]) {
        acc[news.date] = [];
      }
      acc[news.date].push(news);
      return acc;
    }, {} as Record<string, typeof filteredNews>);
  }, [filteredNews]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setSearchParams({ q: searchTerm.trim() });
    } else {
      setSearchParams({});
    }
    setSelectedTag(null);
  };

  const handleTagClick = (tag: string) => {
    setSelectedTag(tag);
    setSearchTerm(tag);
    setSearchParams({ q: tag });
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    setSelectedTag(null);
    setSearchTerm('');
    setSearchParams({});
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">{indexData?.common?.loadingText || '加载中...'}</span>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center text-red-500">
            <p>{indexData?.common?.errorText || '加载数据时出错'}: {error}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen timeline-container">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* 搜索区域 */}
        <div className="timeline-header">
          <h1 className="timeline-title">
            <Calendar className="inline-block w-8 h-8 mr-3" />
            时间轴新闻
          </h1>
          
          <p className="timeline-subtitle">
            探索人工智能领域的最新动态和重要里程碑
          </p>
          
          <form onSubmit={handleSearch} className="timeline-search-box">
            <input
              type="text"
              placeholder="搜索关键词，如：OpenAI、GPT、自动驾驶..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="timeline-search-input"
            />
            <button type="submit" className="timeline-search-button">
              <Search className="w-4 h-4 mr-2" />
              搜索
            </button>
          </form>
          
          {/* 过滤器标签 */}
          <div className="timeline-filters">
            <button
              className={`timeline-filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
              onClick={() => handleFilterChange('all')}
            >
              <Layers className="w-4 h-4 mr-2" />
              全部
            </button>
            <button
              className={`timeline-filter-btn ${activeFilter === 'keyEvents' ? 'active' : ''}`}
              onClick={() => handleFilterChange('keyEvents')}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              关键节点
            </button>
            <button
              className={`timeline-filter-btn ${activeFilter === 'openAI' ? 'active' : ''}`}
              onClick={() => handleFilterChange('openAI')}
            >
              <Filter className="w-4 h-4 mr-2" />
              OpenAI
            </button>
          </div>
          
          {/* 热门标签 */}
          {allTags.length > 0 && (
            <div className="mb-6">
              <p className="text-sm text-muted-foreground mb-2">热门标签：</p>
              <div className="flex flex-wrap gap-2">
                {allTags.slice(0, 8).map((tag) => (
                  <span
                    key={tag}
                    className="timeline-tag"
                    onClick={() => handleTagClick(tag)}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {searchTerm && (
            <p className="text-sm text-muted-foreground">
              找到 {filteredNews.length} 条相关新闻
              {selectedTag && ` (标签: ${selectedTag})`}
              {activeFilter !== 'all' && ` (筛选: ${activeFilter === 'keyEvents' ? '关键节点' : 'OpenAI'})`}
            </p>
          )}
        </div>

        {/* 时间轴内容 */}
        <div className="timeline-wrapper">
          {Object.entries(groupedNews).length === 0 ? (
            <div className="text-center py-12">
              <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg text-muted-foreground">
                {searchTerm ? '没有找到相关新闻' : '暂无新闻数据'}
              </p>
            </div>
          ) : (
            <div>
              {Object.entries(groupedNews)
                .sort(([dateA], [dateB]) => new Date(dateB).getTime() - new Date(dateA).getTime())
                .map(([date, newsItems]) => {
                  const [year, month, day] = date.split('-');
                  const firstNews = newsItems[0];
                  const monthDay = indexData?.common?.dateFormat
                    ?.replace('{month}', month)
                    ?.replace('{day}', day)
                    ?.replace('{weekday}', firstNews.weekday) || `${month}月${day}日·${firstNews.weekday}`;
                  
                  return (
                    <div key={date}>
                      {/* 日期标题 */}
                      <div className="ml-8 mb-4">
                        <h2 className="text-xl font-bold text-foreground">
                          {monthDay}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          {newsItems.length} 条新闻
                        </p>
                      </div>

                      {/* 新闻列表 */}
                      <div>
                        {newsItems.map((news) => (
                          <div key={news.id} className={`timeline-item ${isKeyEvent(news) ? 'timeline-important' : ''}`}>
                            {/* 时间轴圆点 */}
                            <div className="timeline-circle" />
                            
                            <div className="timeline-content">
                              <div className="timeline-date">
                                {news.publishTime}
                              </div>
                              
                              <h3>{news.title}</h3>
                              <p>{news.summary}</p>
                              
                              {/* 标签显示 */}
                              {news.tags && news.tags.length > 0 && (
                                <div className="timeline-tags">
                                  {news.tags.slice(0, 3).map((tag: string) => (
                                    <span
                                      key={tag}
                                      className="timeline-tag"
                                      onClick={() => handleTagClick(tag)}
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                  {news.tags.length > 3 && (
                                    <span className="timeline-tag">
                                      +{news.tags.length - 3}
                                    </span>
                                  )}
                                </div>
                              )}
                              
                              {/* 关键事件提示 */}
                              {isKeyEvent(news) && (
                                <div className="mt-2">
                                  <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-amber-100 text-amber-800 rounded-md">
                                    <Star className="w-3 h-3 mr-1" />
                                    关键事件
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Timeline;