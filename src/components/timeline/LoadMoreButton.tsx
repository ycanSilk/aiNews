import React from 'react';
import './Timeline.css';

interface LoadMoreButtonProps {
  isLoading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  loadingText?: string;
  loadMoreText?: string;
  spinnerIcon?: string;
  plusIcon?: string;
}

const LoadMoreButton: React.FC<LoadMoreButtonProps> = ({
  isLoading,
  hasMore,
  onLoadMore,
  loadingText = "Loading...",
  loadMoreText = "Load more news",
  spinnerIcon = "fas fa-spinner fa-spin",
  plusIcon = "fas fa-plus"
}) => {
  if (!hasMore) return null;

  return (
    <div className="loading" id="loading">
      <button onClick={onLoadMore} disabled={isLoading}>
        {isLoading ? (
          <><i className={spinnerIcon}></i> {loadingText}</>
        ) : (
          <><i className={plusIcon}></i> {loadMoreText}</>
        )}
      </button>
    </div>
  );
};

export default LoadMoreButton;