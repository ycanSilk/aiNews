import React from 'react';
import './Timeline.css';

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
  return (
    <div 
      key={index} 
      className={`timeline-item ${item.important ? "important" : ""}`}
    >
      <div className="timeline-circle"></div>
      <div className="timeline-content">
        <div className="date">
          <i className="fas fa-calendar-alt"></i>
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
          阅读更多 <i className="fas fa-arrow-right"></i>
        </a>
      </div>
    </div>
  );
};

export default TimelineItem;