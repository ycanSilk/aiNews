import React from 'react';
import './Timeline.css';
import { useLanguageData } from '@/hooks/useLanguageData';

interface SearchBoxProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onSearch: () => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({
  searchTerm,
  onSearchChange,
  onSearch
}) => {
  const { data: config, loading, error } = useLanguageData('timeLine.json');

  if (loading) return <div className="search-box">Loading search...</div>;
  if (error) return <div className="search-box">Error loading search</div>;

  const uiTexts = config?.defaultConfig?.uiTexts;
  const hotSearchTags = config?.defaultConfig?.hotSearchTags || [];
  const searchIcon = config?.defaultConfig?.searchIcon || "fas fa-search";

  return (
    <div className="search-box">
      <div className="search-input-group">
        <input 
          type="text" 
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && onSearch()}
          placeholder={uiTexts?.searchPlaceholder || "Enter keywords to search..."}
          className="search-input"
        />
        <button onClick={onSearch} className="search-btn">
          <i className={searchIcon}></i>
        </button>
      </div>
      <div className="hot-search-tags">
        <span>{uiTexts?.hotSearchLabel || "Hot searches:"}</span>
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