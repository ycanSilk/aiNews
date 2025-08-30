import React from 'react';
import './Timeline.css';

interface SearchBoxProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onSearch: () => void;
  placeholder?: string;
  hotSearchTags?: string[];
  hotSearchLabel?: string;
  searchIcon?: string;
}

const SearchBox: React.FC<SearchBoxProps> = ({
  searchTerm,
  onSearchChange,
  onSearch,
  placeholder = "Enter keywords to search...",
  hotSearchTags = [],
  hotSearchLabel = "Hot searches:",
  searchIcon = "fas fa-search"
}) => {

  return (
    <div className="search-box">
      <div className="search-input-group">
        <input 
          type="text" 
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && onSearch()}
          placeholder={placeholder}
          className="search-input"
        />
        <button onClick={onSearch} className="search-btn">
          <i className={searchIcon}></i>
        </button>
      </div>
      <div className="hot-search-tags">
        <span>{hotSearchLabel}</span>
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