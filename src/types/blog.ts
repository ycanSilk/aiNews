// 博客数据类型定义
export interface BlogData {
  _id: string;
  semanticId: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  author: string;
  status: string;
  tags: string[];
  slug: string;
  isFeatured: boolean;
  views: number;
  createdAt: string;
  updatedAt: string;
  isCritical: boolean;
  isHot: boolean;
  isImportant: boolean;
  relatedArticles: any[];
  seoKeywords: string[];
  blogUrl: string;
}