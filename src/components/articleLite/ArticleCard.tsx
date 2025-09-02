import React from 'react';
import { ArticleData } from '@/types/article';

interface ArticleCardProps {
  article: ArticleData;
  lang: string;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, lang }) => {
  const getTitle = () => {
    return article.title?.[lang] || article.title?.ch || '无标题';
  };

  const getContentPreview = () => {
    const content = article.content?.[lang] || article.content?.ch || '';
    return content.length > 150 ? content.substring(0, 150) + '...' : content;
  };

  const getCategoryName = () => {
    if (typeof article.category === 'string') {
      return article.category;
    }
    return article.category?.name?.[lang] || article.category?.name?.ch || '未分类';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(lang === 'ch' ? 'zh-CN' : 'en-US');
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* 封面图片 */}
      {article.coverImage && (
        <img 
          src={article.coverImage} 
          alt={getTitle()}
          className="w-full h-48 object-cover"
        />
      )}
      
      <div className="p-4">
        {/* 分类标签 */}
        {article.category && (
          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mb-2">
            {getCategoryName()}
          </span>
        )}

        {/* 热门和推荐标记 */}
        <div className="flex gap-2 mb-2">
          {article.isHot && (
            <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
              {lang === 'ch' ? '热门' : 'Hot'}
            </span>
          )}
          {article.isRecommended && (
            <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
              {lang === 'ch' ? '推荐' : 'Recommended'}
            </span>
          )}
        </div>

        {/* 标题 */}
        <h3 className="text-xl font-semibold mb-2 line-clamp-2">
          {getTitle()}
        </h3>

        {/* 摘要 */}
        <p className="text-gray-600 mb-4 line-clamp-3">
          {getContentPreview()}
        </p>

        {/* 作者和日期 */}
        <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
          <span>{article.author || '未知作者'}</span>
          <span>{formatDate(article.createdAt)}</span>
        </div>

        {/* 标签 */}
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {article.tags.slice(0, 3).map((tag, index) => (
              <span 
                key={index}
                className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded"
              >
                {typeof tag === 'string' ? tag : tag.name?.[lang] || tag.name?.ch}
              </span>
            ))}
            {article.tags.length > 3 && (
              <span className="text-gray-400 text-xs">
                +{article.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* 统计信息 */}
        <div className="flex justify-between text-sm text-gray-500">
          <span>👁️ {article.viewCount || 0}</span>
          <span>❤️ {article.likeCount || 0}</span>
        </div>

        {/* 查看详情按钮 */}
        <button className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors">
          {lang === 'ch' ? '阅读全文' : 'Read More'}
        </button>
      </div>
    </div>
  );
};

export default ArticleCard;