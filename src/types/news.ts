// 新闻数据类型定义
export interface NewsItem {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage: string;
  categoryId: string;
  tags: string[];
  authorId: string;
  status: 'published' | 'draft' | 'archived';
  publishedAt: string;
  views: number;
  likes: number;
  commentsCount: number;
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
  externalUrl: string;
  createdAt: string;
  updatedAt: string;
}

// 分类数据类型定义
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  parentId: string | null;
  order: number;
  createdAt: string;
  updatedAt: string;
}

// 带分类名称的新闻数据类型
export interface NewsItemWithCategory extends NewsItem {
  categoryName: string;
}