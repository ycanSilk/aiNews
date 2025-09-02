export interface ArticleData {
  _id: string;
  semanticId: string;
  title: {
    ch?: string;
    en?: string;
    [key: string]: string | undefined;
  };
  content: {
    ch?: string;
    en?: string;
    [key: string]: string | undefined;
  };
  highlight: {
    ch?: string;
    en?: string;
    [key: string]: string | undefined;
  };
  author: string;
  category: any; // 可以是字符串或Category对象
  tags: any[]; // 可以是字符串数组或Tag对象数组
  coverImage?: string;
  isHot: boolean;
  isRecommended: boolean;
  viewCount: number;
  likeCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ArticlesResponse {
  data: ArticleData[];
  totalCount: number;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}