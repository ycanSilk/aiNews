import React from 'react';
import './Timeline.css';

interface FilterButtonsProps {
  activeFilter: string;
  onFilterClick: (filter: string) => void;
  filters?: {
    all?: string;
    important?: string;
    product?: string;
    research?: string;
  };
  filterIcons?: {
    all?: string;
    important?: string;
    product?: string;
    research?: string;
  };
}

const FilterButtons: React.FC<FilterButtonsProps> = ({
  activeFilter,
  onFilterClick,
  filters = {
    all: "All",
    important: "Key Milestones",
    product: "Product Launches",
    research: "Research Breakthroughs"
  },
  filterIcons = {
    all: "fas fa-layer-group",
    important: "fas fa-star",
    product: "fas fa-cube",
    research: "fas fa-flask"
  }
}) => {

  return (
    <div className="filters">
      <button 
        className={`filter-btn ${activeFilter === "all" ? "active" : ""}`}
        onClick={() => onFilterClick("all")}
      >
        <i className={filterIcons.all}></i> {filters.all}
      </button>
      <button 
        className={`filter-btn ${activeFilter === "important" ? "active" : ""}`}
        onClick={() => onFilterClick("important")}
      >
        <i className={filterIcons.important}></i> {filters.important}
      </button>
      <button 
        className={`filter-btn ${activeFilter === "product" ? "active" : ""}`}
        onClick={() => onFilterClick("product")}
      >
        <i className={filterIcons.product}></i> {filters.product}
      </button>
      <button 
        className={`filter-btn ${activeFilter === "research" ? "active" : ""}`}
        onClick={() => onFilterClick("research")}
      >
        <i className={filterIcons.research}></i> {filters.research}
      </button>
    </div>
  );
};

export default FilterButtons;