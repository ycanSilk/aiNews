import { Clock } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// 静态配置数据
const staticIndexData = {
  common: {
    viewsText: "Views",
    readMoreText: "Read More"
  }
};

interface NewsCardProps {
  id: string;
  title: string;
  summary: string;
  category: string;
  readTime?: string;
  publishTime: string;
  imageUrl?: string;
  isBreaking?: boolean;
  tags?: string[];
  externalUrl?: string;
}

const NewsCard = ({
  id,
  title,
  summary,
  category,
  readTime = '3分钟',
  publishTime,
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

  // 处理新闻点击事件
  const handleNewsClick = () => {
    if (externalUrl) {
      window.open(externalUrl, '_blank');
    }
  };

  // 将正文内容分割成段落
  const contentParagraphs = summary.split('\n').filter(paragraph => paragraph.trim());

  return (
    <Card 
      className="group hover:shadow-lg transition-all duration-300 cursor-pointer bg-news-card border-0 m-0 relative"
      onClick={handleNewsClick}
    >
      <div className="flex flex-col md:flex-row overflow-hidden">
        <div className="p-3 flex-grow">
          <h3 className="text-lg font-semibold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          
          {/* 段落形式的新闻正文 */}
          <div className="text-muted-foreground text-sm mb-4 space-y-3">
            {contentParagraphs.map((paragraph, index) => (
              <p key={index} className="leading-relaxed">
                {paragraph.trim()}
              </p>
            ))}
          </div>

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