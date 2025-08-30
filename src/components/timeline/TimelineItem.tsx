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
  calendarIcon?: string;
  arrowIcon?: string;
  readMoreText?: string;
}

const TimelineItem: React.FC<TimelineItemProps> = ({ 
  item, 
  index,
  calendarIcon = "fas fa-calendar-alt",
  arrowIcon = "fas fa-arrow-right",
  readMoreText = "Read more"
}) => {

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
          {readMoreText} <i className={arrowIcon}></i>
        </a>
      </div>
    </div>
  );
};

export default TimelineItem;