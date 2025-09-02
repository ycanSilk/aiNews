import React from 'react';
import Timeline from '@/components/timeline/Timeline';
import chineseConfig from '@/data/local/ch/timeLine.json';

const ChineseTimeline = () => {
  return (
    <Timeline 
      config={chineseConfig.ch}
      language="ch"
    />
  );
};

export default ChineseTimeline;