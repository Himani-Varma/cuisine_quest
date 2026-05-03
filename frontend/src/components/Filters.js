import React from 'react';
import './Filters.css';

const Filters = ({ onFilter }) => {
  const cuisines = ['Indian', 'Italian', 'Chinese', 'Mexican', 'Thai', 'Japanese', 'American', 'Mediterranean'];
  const categories = ['Veg', 'Non-Veg', 'Dessert', 'Beverage'];
  const difficulties = ['Easy', 'Medium', 'Hard'];
  const sorts = [
    { value: 'newest', label: 'Newest' },
    { value: 'oldest', label: 'Oldest' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'rated', label: 'Highest Rated' },
  ];

  const handleCuisineChange = (e) => {
    onFilter({ cuisine: e.target.value });
  };

  const handleCategoryChange = (e) => {
    onFilter({ category: e.target.value });
  };

  const handleDifficultyChange = (e) => {
    onFilter({ difficulty: e.target.value });
  };

  const handleSortChange = (e) => {
    onFilter({ sort: e.target.value });
  };

  return (
    <div className="filters">
      <div className="filter-group">
        <label>Cuisine:</label>
        <select onChange={handleCuisineChange}>
          <option value="">All Cuisines</option>
          {cuisines.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label>Category:</label>
        <select onChange={handleCategoryChange}>
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label>Difficulty:</label>
        <select onChange={handleDifficultyChange}>
          <option value="">All Levels</option>
          {difficulties.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label>Sort:</label>
        <select onChange={handleSortChange}>
          <option value="">Default</option>
          {sorts.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Filters;
