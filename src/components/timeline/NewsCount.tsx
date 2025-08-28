import React from 'react';
import './Timeline.css';

interface NewsCountProps {
  count: number;
}

const NewsCount: React.FC<NewsCountProps> = ({ count }) => {
  return (
    <div className="news-count">
      显示 {count} 条新闻
    </div>
  );
};

export default NewsCount;