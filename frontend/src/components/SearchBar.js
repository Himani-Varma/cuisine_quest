import React, { useState } from 'react';
import './SearchBar.css';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Search recipes by title, ingredients..."
        value={query}
        onChange={handleChange}
        className="search-input"
      />
      <button type="submit" className="search-btn">Search</button>
    </form>
  );
};

export default SearchBar;
