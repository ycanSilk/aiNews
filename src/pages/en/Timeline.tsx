import React from 'react';
import Timeline from '@/components/timeline/Timeline';
import englishConfig from '@/data/local/en/timeLine.json';

const EnglishTimeline = () => {
  return (
    <Timeline 
      config={englishConfig.en}
      language="en"
    />
  );
};

export default EnglishTimeline;