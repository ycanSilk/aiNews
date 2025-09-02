import React, { useState, useEffect } from 'react';
import { useArticlesData } from '@/hooks/useArticlesData';
import ArticleCard from './ArticleCard';
import { ArticleData } from '@/types/article';

interface ArticlesListProps {
  lang: string;
}

const ArticlesList: React.FC<ArticlesListProps> = ({ lang }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showHotOnly, setShowHotOnly] = useState(false);
  const [showRecommendedOnly, setShowRecommendedOnly] = useState(false);

  const { articles, loading, error, refetch } = useArticlesData(lang, {
    page: currentPage,
    limit: pageSize,
    category: selectedCategory,
    isHot: showHotOnly ? true : undefined,
    isRecommended: showRecommendedOnly ? true : undefined
  });

  useEffect(() => {
    refetch();
  }, [currentPage, pageSize, selectedCategory, showHotOnly, showRecommendedOnly, lang]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">加载中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-500">加载失败: {error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 头部筛选区域 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">
          {lang === 'ch' ? '文章列表' : 'Articles List'}
        </h1>
        
        <div className="flex flex-wrap gap-4 mb-4">
          <select 
            className="px-4 py-2 border rounded"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">所有分类</option>
            {/* 分类选项将在后续添加 */}
          </select>
          
          <label className="flex items-center gap-2">
            <input 
              type="checkbox" 
              checked={showHotOnly}
              onChange={(e) => setShowHotOnly(e.target.checked)}
            />
            {lang === 'ch' ? '热门文章' : 'Hot Articles'}
          </label>
          
          <label className="flex items-center gap-2">
            <input 
              type="checkbox" 
              checked={showRecommendedOnly}
              onChange={(e) => setShowRecommendedOnly(e.target.checked)}
            />
            {lang === 'ch' ? '推荐文章' : 'Recommended Articles'}
          </label>
        </div>
      </div>

      {/* 文章列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {articles.map((article: ArticleData) => (
          <ArticleCard 
            key={article._id} 
            article={article} 
            lang={lang}
          />
        ))}
      </div>

      {/* 分页控件 */}
      <div className="flex justify-center gap-2">
        <button 
          className="px-4 py-2 border rounded disabled:opacity-50"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          上一页
        </button>
        
        <span className="px-4 py-2">
          第 {currentPage} 页
        </span>
        
        <button 
          className="px-4 py-2 border rounded disabled:opacity-50"
          disabled={articles.length < pageSize}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          下一页
        </button>
      </div>
    </div>
  );
};

export default ArticlesList;