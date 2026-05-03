import React, { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import Filters from '../components/Filters';
import RecipeCard from '../components/RecipeCard';
import { recipeAPI } from '../api';
import './Pages.css';

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [trendingRecipes, setTrendingRecipes] = useState([]);
  const [recentRecipes, setRecentRecipes] = useState([]);
  const [topRatedRecipes, setTopRatedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadRecipes = async () => {
      try {
        setLoading(true);
        const params = { ...filters };
        if (searchQuery) params.search = searchQuery;

        const [allRes, trendingRes, recentRes, topRatedRes] = await Promise.all([
          recipeAPI.getAllRecipes(params),
          recipeAPI.getTrendingRecipes(),
          recipeAPI.getRecentRecipes(),
          recipeAPI.getTopRatedRecipes(),
        ]);

        setRecipes(allRes.data.recipes);
        setTrendingRecipes(trendingRes.data.recipes);
        setRecentRecipes(recentRes.data.recipes);
        setTopRatedRecipes(topRatedRes.data.recipes);
      } catch (error) {
        console.error('Error loading recipes:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRecipes();
  }, [filters, searchQuery]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleFilter = (filterObj) => {
    setFilters((prev) => ({ ...prev, ...filterObj }));
  };

  return (
    <div className="home-page">
      <div className="hero">
        <h1>Welcome to CuisineQuest</h1>
        <p>Discover, Share, and Enjoy Amazing Recipes</p>
      </div>

      <SearchBar onSearch={handleSearch} />
      <Filters onFilter={handleFilter} />

      {loading ? (
        <div className="loading">Loading recipes...</div>
      ) : (
        <>
          {searchQuery || Object.keys(filters).length > 0 ? (
            <>
              <h2>Search Results ({recipes.length})</h2>
              <div className="recipes-grid">
                {recipes.length > 0 ? (
                  recipes.map((recipe) => <RecipeCard key={recipe._id} recipe={recipe} />)
                ) : (
                  <p className="no-results">No recipes found. Try different filters!</p>
                )}
              </div>
            </>
          ) : (
            <>
              <section className="recipe-section">
                <h2>Trending Recipes</h2>
                <div className="recipes-grid">
                  {trendingRecipes.map((recipe) => (
                    <RecipeCard key={recipe._id} recipe={recipe} />
                  ))}
                </div>
              </section>

              <section className="recipe-section">
                <h2>Recently Added</h2>
                <div className="recipes-grid">
                  {recentRecipes.map((recipe) => (
                    <RecipeCard key={recipe._id} recipe={recipe} />
                  ))}
                </div>
              </section>

              <section className="recipe-section">
                <h2>Top Rated</h2>
                <div className="recipes-grid">
                  {topRatedRecipes.map((recipe) => (
                    <RecipeCard key={recipe._id} recipe={recipe} />
                  ))}
                </div>
              </section>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Home;
