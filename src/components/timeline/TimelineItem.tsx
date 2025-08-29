import React from 'react';
import './Timeline.css';
import { useLanguageData } from '@/hooks/useLanguageData';

interface NewsItem {
  date: string;
  title: string;
  content: string;
  important: boolean;
  tags: string[];
  url: string;
}

interface TimelineItemProps {
  item: NewsItem;
  index: number;
}

const TimelineItem: React.FC<TimelineItemProps> = ({ item, index }) => {
  const { data: config, loading, error } = useLanguageData('timeLine.json');

  if (loading) return <div className="timeline-item">Loading...</div>;
  if (error) return <div className="timeline-item">Error</div>;

  const uiTexts = config?.defaultConfig?.uiTexts;
  const calendarIcon = config?.defaultConfig?.calendarIcon || "fas fa-calendar-alt";
  const arrowIcon = config?.defaultConfig?.arrowIcon || "fas fa-arrow-right";

  return (
    <div 
      key={index} 
      className={`timeline-item ${item.important ? "important" : ""}`}
    >
      <div className="timeline-circle"></div>
      <div className="timeline-content">
        <div className="date">
          <i className={calendarIcon}></i>
          {item.date}
        </div>
        <h2>{item.title}</h2>
        <p>{item.content}</p>
        <div className="tags">
          {item.tags.map((tag, tagIndex) => (
            <span key={tagIndex} className="tag">
              {tag}
            </span>
          ))}
        </div>
        <a href={item.url} className="read-more mt-5">
          {uiTexts?.readMore || "Read more"} <i className={arrowIcon}></i>
        </a>
      </div>
    </div>
  );
};

export default TimelineItem;