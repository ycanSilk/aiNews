import { useState, useEffect } from 'react';
import { ArticleData } from '@/types/article';

interface UseArticlesDataOptions {
  page?: number;
  limit?: number;
  category?: string;
  isHot?: boolean;
  isRecommended?: boolean;
}

interface UseArticlesDataResult {
  articles: ArticleData[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  refetch: () => void;
}

export const useArticlesData = (
  lang: string = 'ch', 
  options: UseArticlesDataOptions = {}
): UseArticlesDataResult => {
  const [articles, setArticles] = useState<ArticleData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  const buildQueryString = () => {
    const params = new URLSearchParams();
    params.append('lang', lang);
    
    if (options.page) params.append('page', options.page.toString());
    if (options.limit) params.append('limit', options.limit.toString());
    if (options.category) params.append('category', options.category);
    if (options.isHot !== undefined) params.append('isHot', options.isHot.toString());
    if (options.isRecommended !== undefined) params.append('isRecommended', options.isRecommended.toString());
    
    return params.toString();
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const queryString = buildQueryString();
      const response = await fetch(`/api/v1/articles?${queryString}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      // 格式化数据
      const formattedArticles: ArticleData[] = result.data.map((article: any) => ({
        _id: article._id,
        semanticId: article.semanticId,
        title: article.title,
        content: article.content,
        highlight: article.highlight,
        author: article.author?.username || article.author || 'Unknown',
        category: article.category,
        tags: article.tags,
        coverImage: article.coverImage,
        isHot: article.isHot,
        isRecommended: article.isRecommended,
        viewCount: article.viewCount,
        likeCount: article.likeCount,
        createdAt: article.createdAt,
        updatedAt: article.updatedAt
      }));
      
      setArticles(formattedArticles);
      setTotalCount(result.totalCount || formattedArticles.length);
    } catch (err) {
      console.error('Failed to fetch articles data:', err);
      setError('Failed to load articles data');
      setArticles([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [lang, options.page, options.limit, options.category, options.isHot, options.isRecommended]);

  const refetch = () => {
    fetchData();
  };

  return { articles, loading, error, totalCount, refetch };
};

export default useArticlesData;