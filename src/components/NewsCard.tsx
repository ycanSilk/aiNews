import { Clock, Eye } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguageData } from '@/hooks/useLanguageData';
import { useLanguage } from '@/contexts/LanguageContext';
// 导入工具函数
import { formatDateByLanguage, generateIncrementedViews } from '@/lib/utils';

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
  tags = []
}: NewsCardProps) => {
  // 使用语言数据钩子加载通用文本配置
  const { data: indexData } = useLanguageData<any>('index.json');
  const { currentLanguage } = useLanguage();
  // 将摘要分割成列表项
  const summaryItems = summary.split('。').filter(item => item.trim());

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer bg-news-card border-0 border-b-2 border-blue-500 m-0 relative md:max-h-40">
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
                  {generateIncrementedViews(views || 0)} {indexData?.common?.viewsText || '次阅读'}
                </span>
              </div>

            </div>
            <a href="#" className="text-primary font-medium hover:underline transition-all duration-200 ">
              {indexData?.common?.readMoreText || '查看详情'}
            </a>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default NewsCard;