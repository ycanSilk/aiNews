import React from 'react';
import './Timeline.css';
import { useLanguageData } from '@/hooks/useLanguageData';

interface NewsCountProps {
  count: number;
}

const NewsCount: React.FC<NewsCountProps> = ({ count }) => {
  const { data: config, loading, error } = useLanguageData('timeLine.json');

  if (loading) return <div className="news-count">Loading...</div>;
  if (error) return <div className="news-count">Error</div>;

  const uiTexts = config?.defaultConfig?.uiTexts;
  const newsCountText = uiTexts?.newsCount || "Showing {count} news items";

  return (
    <div className="news-count">
      {newsCountText.replace('{count}', count.toString())}
    </div>
  );
};

export default NewsCount;