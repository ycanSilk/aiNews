import FilterButtons from '@/components/timeline/FilterButtons';
import LoadMoreButton from '@/components/timeline/LoadMoreButton';
import NewsCount from '@/components/timeline/NewsCount';
import SearchBox from '@/components/timeline/SearchBox';
import TimelineItem from '@/components/timeline/TimelineItem';
import TimelineHeader from '@/components/timeline/TimelineHeader';

const Timeline = () => {
  return (
    <div className="min-h-screen bg-background">
      <FilterButtons />
      <LoadMoreButton />
      <NewsCount />
      <SearchBox />
      <TimelineItem />
      <TimelineHeader />
    </div>
  );
};

export default Timeline;
