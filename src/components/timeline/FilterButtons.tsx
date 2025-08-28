import React from 'react';
import './Timeline.css';

interface FilterButtonsProps {
  activeFilter: string;
  onFilterClick: (filter: string) => void;
}

const FilterButtons: React.FC<FilterButtonsProps> = ({
  activeFilter,
  onFilterClick
}) => {
  return (
    <div className="filters">
      <button 
        className={`filter-btn ${activeFilter === "all" ? "active" : ""}`}
        onClick={() => onFilterClick("all")}
      >
        <i className="fas fa-layer-group"></i> 全部
      </button>
      <button 
        className={`filter-btn ${activeFilter === "important" ? "active" : ""}`}
        onClick={() => onFilterClick("important")}
      >
        <i className="fas fa-star"></i> 关键节点
      </button>
      <button 
        className={`filter-btn ${activeFilter === "product" ? "active" : ""}`}
        onClick={() => onFilterClick("product")}
      >
        <i className="fas fa-cube"></i> 产品发布
      </button>
      <button 
        className={`filter-btn ${activeFilter === "research" ? "active" : ""}`}
        onClick={() => onFilterClick("research")}
      >
        <i className="fas fa-flask"></i> 研究突破
      </button>
    </div>
  );
};

export default FilterButtons;