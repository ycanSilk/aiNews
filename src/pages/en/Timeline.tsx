import React, { useState } from 'react';
import FilterButtons from '@/components/timeline/FilterButtons';
import LoadMoreButton from '@/components/timeline/LoadMoreButton';
import NewsCount from '@/components/timeline/NewsCount';
import SearchBox from '@/components/timeline/SearchBox';
import TimelineItem from '@/components/timeline/TimelineItem';
import TimelineHeader from '@/components/timeline/TimelineHeader';
import Header from "@/components/Header";
import Footer from "@/components/Footer";


const Timeline = () => {
  const [searchTerm, setSearchTerm] = useState('OpenAI');
  const [activeFilter, setActiveFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 500);
  };

  const handleFilterClick = (filter: string) => {
    setActiveFilter(filter);
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 500);
  };

  const handleLoadMore = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  // 示例数据
  const sampleItem = {
    date: "2024-01-01",
    title: "Sample News Item",
    content: "This is a sample news item for demonstration purposes.",
    important: true,
    tags: ["AI", "Sample"],
    url: "#"
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <TimelineHeader 
        title="Timeline News" 
        subtitle="Explore important milestones in AI development"
      >
        <SearchBox 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          handleSearch={handleSearch}
          hotSearchTags={['OpenAI', 'GPT-5', 'AI', 'Machine Learning']}
        />
      </TimelineHeader>
      
      <NewsCount count={5} />
      
      <FilterButtons 
        activeFilter={activeFilter}
        handleFilterClick={handleFilterClick}
      />
      
      <TimelineItem 
        item={sampleItem}
        index={0}
      />
      
      <LoadMoreButton 
        isLoading={isLoading}
        handleLoadMore={handleLoadMore}
      />

      <Footer />
    </div>
  );
};

export default Timeline;
