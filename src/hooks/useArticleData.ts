import { useState, useEffect } from 'react';
import { ArticleData } from '../components/articleLite/ArticleComponent';

interface UseArticleDataResult {
  data: ArticleData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useArticleData = (lang: string = 'ch'): UseArticleDataResult => {
  const [data, setData] = useState<ArticleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/articles?lang=${lang}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      // 将MongoDB返回的数据转换为ArticleComponent需要的格式
      const formattedData: ArticleData = {
        pageTitle: lang === 'ch' ? 'AI新闻深度解析' : 'AI News Deep Analysis',
        subtitle: lang === 'ch' 
          ? '探索人工智能领域的最新动态、技术突破与未来趋势'
          : 'Exploring the latest developments, technological breakthroughs and future trends in the field of artificial intelligence',
        articles: result.data.map((article: any) => ({
          id: article.id,
          coverImage: article.coverImage,
          title: article.title,
          author: article.author?.username || article.author || 'Unknown',
          date: article.date,
          content: article.content,
          highlight: article.highlight,
          tags: article.tags?.map((tag: any) => tag.name?.[lang] || tag.name?.ch || tag.name?.en || tag.value || tag) || []
        })),
        footerText: lang === 'ch' 
          ? 'AI新闻资讯平台 © 2024 | 探索人工智能的无限可能'
          : 'AI News Information Platform © 2024 | Exploring the Infinite Possibilities of Artificial Intelligence'
      };
      
      setData(formattedData);
    } catch (err) {
      console.error('Failed to fetch article data:', err);
      setError('Failed to load article data');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [lang]);

  const refetch = () => {
    fetchData();
  };

  return { data, loading, error, refetch };
};

export default useArticleData;