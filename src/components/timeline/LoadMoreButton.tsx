import React from 'react';
import './Timeline.css';

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
  if (!hasMore) return null;
  
  return (
    <div className="loading" id="loading">
      <button onClick={onLoadMore} disabled={isLoading}>
        {isLoading ? (
          <><i className="fas fa-spinner fa-spin"></i> 加载中...</>
        ) : (
          <><i className="fas fa-plus"></i> 加载更多新闻</>
        )}
      </button>
    </div>
  );
};

export default LoadMoreButton;