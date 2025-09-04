import React from 'react';
import './Timeline.css';

interface TimelineHeaderProps {
  title: string;
  subtitle: string;
  children?: React.ReactNode
}

const TimelineHeader: React.FC<TimelineHeaderProps> = ({
  title,
  subtitle,
  children
}) => {

  return (
    <header className="timelin-header">
      <h2 className='mb-5 text-3xl font-bold text-[#039797]'>{title}</h2>
      <p className="subtitle">{subtitle}</p>
      {children}
    </header>
  );
};

export default TimelineHeader;