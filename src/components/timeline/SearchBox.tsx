import React from 'react';
import './Timeline.css';

interface SearchBoxProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onSearch: () => void;
  hotSearchTags: string[];
}

const SearchBox: React.FC<SearchBoxProps> = ({
  searchTerm,
  onSearchChange,
  onSearch,
  hotSearchTags
}) => {
  return (
    <div className="search-box">
      <div className="search-input-group">
        <input 
          type="text" 
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && onSearch()}
          placeholder="输入关键词搜索..."
          className="search-input"
        />
        <button onClick={onSearch} className="search-btn">
          <i className="fas fa-search"></i>
        </button>
      </div>
      <div className="hot-search-tags">
        <span>热门搜索：</span>
        {hotSearchTags.map((tag, index) => (
          <span 
            key={index} 
            className="hot-tag"
            onClick={() => {
              onSearchChange(tag);
              onSearch();
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default SearchBox;