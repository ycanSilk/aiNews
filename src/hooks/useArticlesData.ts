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
  refetch: () => void;
}

// 静态文章数据
const staticArticles: ArticleData[] = [
  {
    _id: '1',
    title: 'AI Revolution in Healthcare',
    content: 'Artificial intelligence is transforming healthcare with advanced diagnostics and personalized treatment plans.',
    category: 'AI Applications',
    publishDate: '2024-01-15',
    isHot: true,
    isRecommended: true,
    imageUrl: '/placeholder.svg',
    author: 'AI News Team',
    readTime: 5
  },
  {
    _id: '2', 
    title: 'Machine Learning Breakthrough',
    content: 'New machine learning algorithms are achieving unprecedented accuracy in complex pattern recognition tasks.',
    category: 'Machine Learning',
    publishDate: '2024-01-10',
    isHot: false,
    isRecommended: true,
    imageUrl: '/placeholder.svg',
    author: 'Tech Research',
    readTime: 8
  },
  {
    _id: '3',
    title: 'Natural Language Processing Advances',
    content: 'Recent developments in NLP are enabling more natural and context-aware conversations with AI assistants.',
    category: 'NLP',
    publishDate: '2024-01-05',
    isHot: true,
    isRecommended: false,
    imageUrl: '/placeholder.svg',
    author: 'Language AI Labs',
    readTime: 6
  }
];

export const useArticlesData = (
  lang: string,
  options: UseArticlesDataOptions = {}
): UseArticlesDataResult => {
  const [articles, setArticles] = useState<ArticleData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // 模拟API延迟
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 应用筛选条件
      let filteredArticles = [...staticArticles];
      
      if (options.category) {
        filteredArticles = filteredArticles.filter(article => 
          article.category === options.category
        );
      }
      
      if (options.isHot) {
        filteredArticles = filteredArticles.filter(article => article.isHot);
      }
      
      if (options.isRecommended) {
        filteredArticles = filteredArticles.filter(article => article.isRecommended);
      }
      
      // 应用分页
      if (options.page && options.limit) {
        const startIndex = (options.page - 1) * options.limit;
        filteredArticles = filteredArticles.slice(startIndex, startIndex + options.limit);
      }
      
      setArticles(filteredArticles);
    } catch (err) {
      console.error('Failed to load articles:', err);
      setError('Failed to load articles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [lang, JSON.stringify(options)]);

  return {
    articles,
    loading,
    error,
    refetch: fetchArticles
  };
};