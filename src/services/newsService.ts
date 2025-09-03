import { NewsItem, Category } from '../types/news';

// 新闻数据类型定义
export interface NewsItemWithCategory extends NewsItem {
  categoryName: string;
}

// 加载新闻数据并处理分类映射
export const loadNewsData = async (): Promise<NewsItemWithCategory[]> => {
  try {
    // 加载新闻数据
    const newsResponse = await fetch('/databases/news.json');
    const newsData: NewsItem[] = await newsResponse.json();
    
    // 加载分类数据
    const categoriesResponse = await fetch('/databases/categories.json');
    const categoriesData: Category[] = await categoriesResponse.json();
    
    // 创建分类ID到名称的映射表
    const categoryMap = categoriesData.reduce((map: Record<string, string>, category) => {
      map[category.id] = category.name;
      return map;
    }, {});
    
    // 为新闻数据添加分类名称
    return newsData.map(news => ({
      ...news,
      categoryName: categoryMap[news.categoryId] || 'Unknown'
    }));
  } catch (error) {
    console.error('加载新闻数据失败:', error);
    return [];
  }
};

// 加载分类数据
export const loadCategoriesData = async (): Promise<Category[]> => {
  try {
    const response = await fetch('/databases/categories.json');
    return await response.json();
  } catch (error) {
    console.error('加载分类数据失败:', error);
    return [];
  }
};

// 获取热门新闻（按浏览量排序）
export const getHotNews = (newsData: NewsItemWithCategory[], limit: number = 10): NewsItemWithCategory[] => {
  return [...newsData]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, limit);
};

// 根据分类筛选新闻
export const filterNewsByCategory = (
  newsData: NewsItemWithCategory[], 
  category: string
): NewsItemWithCategory[] => {
  if (category === 'All') {
    return newsData;
  }
  return newsData.filter(news => news.categoryName === category);
};

// 根据日期范围筛选新闻
export const filterNewsByDateRange = (
  newsData: NewsItemWithCategory[], 
  startDate: string | null, 
  endDate: string | null
): NewsItemWithCategory[] => {
  if (!startDate && !endDate) {
    return newsData;
  }
  
  const startTime = startDate ? new Date(startDate).getTime() : null;
  const endTime = endDate ? new Date(endDate).getTime() + 86399999 : null;
  
  return newsData.filter(news => {
    const newsTime = new Date(news.publishedAt).getTime();
    
    if (startTime && newsTime < startTime) {
      return false;
    }
    
    if (endTime && newsTime > endTime) {
      return false;
    }
    
    return true;
  });
};

// 根据关键词搜索新闻（模糊搜索）
export const searchNewsByKeyword = (
  newsData: NewsItemWithCategory[], 
  keyword: string
): NewsItemWithCategory[] => {
  if (!keyword.trim()) {
    return newsData;
  }
  
  const searchTerm = keyword.toLowerCase().trim();
  
  return newsData.filter(news => {
    // 搜索标题
    const titleMatch = news.title.toLowerCase().includes(searchTerm);
    // 搜索内容
    const contentMatch = news.content.toLowerCase().includes(searchTerm);
    // 搜索标签
    const tagsMatch = news.tags?.some(tag => 
      tag.toLowerCase().includes(searchTerm)
    ) || false;
    
    return titleMatch || contentMatch || tagsMatch;
  });
};