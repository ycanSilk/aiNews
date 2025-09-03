import React from 'react';
import Timeline from '@/components/timeline/Timeline';

// 静态配置数据 - 数据库功能已禁用
const staticTimelineConfig = {
  title: "AI News Timeline",
  subtitle: "Latest developments in artificial intelligence",
  defaultSearchTerm: "OpenAI",
  hotSearchTags: ["AI","DeepSeek", "OpenAI", "GPT-4", "Claude","DALL-E","Gemini ","Llama ", "Qwen3","ChatGPT"],
  uiTexts: {
    searchPlaceholder: "Search AI news...",
    hotSearchLabel: "Hot searches:",
    filters: {
      all: "All",
      important: "Important",
      product: "Product Updates",
      research: "Research"
    },
    newsCount: "{count} news found",
    loading: "Loading...",
    loadMore: "Load More",
    readMore: "Read more"
  }
};

const EnglishTimeline = () => {
  return (
    <Timeline 
      config={staticTimelineConfig}
      language="en"
    />
  );
};

export default EnglishTimeline;