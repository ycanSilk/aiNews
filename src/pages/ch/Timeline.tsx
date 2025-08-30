import React from 'react';
import Timeline from '@/components/timeline/Timeline';
import chineseConfig from '@/data/local/cn/timeLine.json';

const ChineseTimeline = () => {
  return (
    <Timeline 
      config={chineseConfig.cn}
      language="cn"
    />
  );
};

export default ChineseTimeline;