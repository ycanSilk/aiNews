import React from 'react';
import './Timeline.css';
import { useLanguageData } from '@/hooks/useLanguageData';

interface LoadMoreButtonProps {
  isLoading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
}

const LoadMoreButton: React.FC<LoadMoreButtonProps> = ({
  isLoading,
  hasMore,
  onLoadMore
}) => {
  const { data: config, loading, error } = useLanguageData('timeLine.json');

  if (!hasMore) return null;
  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="loading">Error</div>;

  const uiTexts = config?.defaultConfig?.uiTexts;
  const spinnerIcon = config?.defaultConfig?.spinnerIcon || "fas fa-spinner fa-spin";
  const plusIcon = config?.defaultConfig?.plusIcon || "fas fa-plus";

  return (
    <div className="loading" id="loading">
      <button onClick={onLoadMore} disabled={isLoading}>
        {isLoading ? (
          <><i className={spinnerIcon}></i> {uiTexts?.loading || "Loading..."}</>
        ) : (
          <><i className={plusIcon}></i> {uiTexts?.loadMore || "Load more news"}</>
        )}
      </button>
    </div>
  );
};

export default LoadMoreButton;