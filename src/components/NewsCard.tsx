import { Clock, Eye, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface NewsCardProps {
  title: string;
  summary: string;
  category: string;
  readTime: string;
  publishTime: string;
  views: number;
  comments: number;
  imageUrl?: string;
  isBreaking?: boolean;
}

const NewsCard = ({
  title,
  summary,
  category,
  readTime,
  publishTime,
  views,
  comments,
  imageUrl,
  isBreaking = false
}: NewsCardProps) => {
  // 将摘要分割成列表项
  const summaryItems = summary.split('。').filter(item => item.trim());

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer bg-news-card border-0 border-b-2 border-blue-500 m-0 relative md:max-h-40">
      <div className="flex flex-col md:flex-row  md:max-h-48 lg:max-h-56 xl:max-h-64 overflow-hidden">
        {/* 左侧图片 */}
        <div className="md:w-1/3 relative flex-shrink-0 w-30rem h-48rem">
          <div className="bg-blue-500 w-full h-full">色块填充替代图片</div>
          {isBreaking && (
            <Badge className="absolute top-3 left-3 bg-breaking-red text-white hover:bg-breaking-red">
              突发
            </Badge>
          )}
          <Badge className="absolute top-3 right-3 bg-tech-blue-light text-tech-blue hover:bg-tech-blue-light">
            {category}
          </Badge>
        </div>

        {/* 右侧内容 */}
        <div className="md:w-2/3 p-3 flex-grow">
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

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>{publishTime}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye className="w-3 h-3 text-primary" />
                <span className="text-primary">{views}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageSquare className="w-3 h-3 text-primary" />
                <span className="text-primary">{comments}</span>
              </div>
            </div>
            <a href="#" className="text-primary font-medium hover:underline transition-all duration-200">查看详情</a>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default NewsCard;