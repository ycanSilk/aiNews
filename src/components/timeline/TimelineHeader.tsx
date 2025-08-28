import React from 'react';
import './Timeline.css';

interface TimelineHeaderProps {
  title: string;
  subtitle: string;
  children?: React.ReactNode;
}

const TimelineHeader: React.FC<TimelineHeaderProps> = ({
  title,
  subtitle,
  children
}) => {
  return (
    <header className="timelin-header">
      <h1 className='mb-5 text-3xl font-bold'><i className="fas fa-newspaper"></i> {title}</h1>
      <p className="subtitle">{subtitle}</p>
      {children}
    </header>
  );
};

export default TimelineHeader;