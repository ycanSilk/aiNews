import React from 'react';
import './Timeline.css';
import { useLanguageData } from '@/hooks/useLanguageData';

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
  const { data: config, loading, error } = useLanguageData('timeLine.json');

  if (loading) return <header className="timelin-header">Loading header...</header>;
  if (error) return <header className="timelin-header">Error loading header</header>;

  const newspaperIcon = config?.defaultConfig?.newspaperIcon || "fas fa-newspaper";

  return (
    <header className="timelin-header">
      <h1 className='mb-5 text-3xl font-bold'><i className={newspaperIcon}></i> {title}</h1>
      <p className="subtitle">{subtitle}</p>
      {children}
    </header>
  );
};

export default TimelineHeader;