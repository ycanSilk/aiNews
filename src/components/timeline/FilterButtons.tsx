import React from 'react';
import './Timeline.css';
import { useLanguageData } from '@/hooks/useLanguageData';

interface FilterButtonsProps {
  activeFilter: string;
  onFilterClick: (filter: string) => void;
}

const FilterButtons: React.FC<FilterButtonsProps> = ({
  activeFilter,
  onFilterClick
}) => {
  const { data: config, loading, error } = useLanguageData('timeLine.json');

  if (loading) return <div className="filters">Loading filters...</div>;
  if (error) return <div className="filters">Error loading filters</div>;

  const filterTexts = config?.defaultConfig?.uiTexts?.filters;
  const filterIcons = config?.defaultConfig?.filterIcons;

  return (
    <div className="filters">
      <button 
        className={`filter-btn ${activeFilter === "all" ? "active" : ""}`}
        onClick={() => onFilterClick("all")}
      >
        <i className={filterIcons?.all || "fas fa-layer-group"}></i> {filterTexts?.all || "All"}
      </button>
      <button 
        className={`filter-btn ${activeFilter === "important" ? "active" : ""}`}
        onClick={() => onFilterClick("important")}
      >
        <i className={filterIcons?.important || "fas fa-star"}></i> {filterTexts?.important || "Key Milestones"}
      </button>
      <button 
        className={`filter-btn ${activeFilter === "product" ? "active" : ""}`}
        onClick={() => onFilterClick("product")}
      >
        <i className={filterIcons?.product || "fas fa-cube"}></i> {filterTexts?.product || "Product Launches"}
      </button>
      <button 
        className={`filter-btn ${activeFilter === "research" ? "active" : ""}`}
        onClick={() => onFilterClick("research")}
      >
        <i className={filterIcons?.research || "fas fa-flask"}></i> {filterTexts?.research || "Research Breakthroughs"}
      </button>
    </div>
  );
};

export default FilterButtons;