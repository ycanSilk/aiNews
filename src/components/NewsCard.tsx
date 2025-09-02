import { Clock, Eye } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// 静态配置数据
const staticIndexData = {
  common: {
    viewsText: "次阅读",
    readMoreText: "查看详情"
  }
};

interface NewsCardProps {
  title: string;
  summary: string;
  category: string;
  readTime?: string;
  publishTime: string;
  views: number;
  imageUrl?: string;
  isBreaking?: boolean;
  tags?: string[];
  externalUrl?: string;
}

const NewsCard = ({
  title,
  summary,
  category,
  readTime = '3分钟',
  publishTime,
  views,
  imageUrl,
  isBreaking = false,
  tags = [],
  externalUrl
}: NewsCardProps) => {
  // 使用静态配置
  const currentLanguage = 'en';
  
  // 简单的日期格式化函数
  const formatDateByLanguage = (dateString: string, language: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'ch' ? 'zh-CN' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // 简单的浏览量格式化函数
  const generateIncrementedViews = (views: number) => {
    if (views >= 1000) {
      return (views / 1000).toFixed(1) + 'k';
    }
    return views.toString();
  };

  // 将摘要分割成列表项
  const summaryItems = summary.split('。').filter(item => item.trim());

  return (
    <Card 
      className="group hover:shadow-lg transition-all duration-300 cursor-pointer bg-news-card border-0 border-b-2 border-blue-500 m-0 relative md:max-h-40"
      onClick={() => externalUrl && window.open(externalUrl, '_blank')}
    >
      <div className="flex flex-col md:flex-row overflow-hidden">
        <div className="p-3 flex-grow">
          <h3 className="text-lg font-semibold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          
          {/* 列表形式的新闻正文 */}
          <ul className="text-muted-foreground text-sm mb-4 space-y-1">
            {summaryItems.map((item, index) => (
              <li key={index} className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>{item.trim()}.</span>
              </li>
            ))}
          </ul>

          {/* 标签显示 */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>{formatDateByLanguage(publishTime, currentLanguage)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye className="w-3 h-3 text-primary" />
                <span className="text-primary">
                  {generateIncrementedViews(views || 0)} {staticIndexData.common.viewsText}
                </span>
              </div>

            </div>
            <a 
              href={externalUrl || '#'} 
              className="text-primary font-medium hover:underline transition-all duration-200 "
              onClick={(e) => {
                if (!externalUrl) {
                  e.preventDefault();
                }
              }}
              target="_blank"
              rel="noopener noreferrer"
            >
              {staticIndexData.common.readMoreText}
            </a>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default NewsCard;