import React from 'react';
import './Timeline.css';

interface NewsCountProps {
  count: number;
  textTemplate?: string;
  newspaperIcon?: string;
}

const NewsCount: React.FC<NewsCountProps> = ({ 
  count, 
  textTemplate = "Showing {count} news items",
  newspaperIcon = "fas fa-newspaper"
}) => {

  return (
    <div className="news-count">
      {textTemplate.replace('{count}', count.toString())}
    </div>
  );
};

export default NewsCount;