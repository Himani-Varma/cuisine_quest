import React from 'react';
import { Link } from 'react-router-dom';
import './RecipeCard.css';

const RecipeCard = ({ recipe }) => {
  return (
    <Link to={`/recipe/${recipe._id}`} className="recipe-card-link">
      <div className="recipe-card">
        <div className="recipe-image">
          <img src={recipe.image || "/placeholder.svg"} alt={recipe.title} />
          <div className="recipe-overlay">
            <span className="recipe-difficulty">{recipe.difficulty}</span>
          </div>
        </div>
        <div className="recipe-info">
          <h3>{recipe.title}</h3>
          <p className="recipe-creator">by {recipe.owner?.username || 'Unknown'}</p>
          <p className="recipe-cuisine">{recipe.cuisine} • {recipe.category}</p>
          <p className="recipe-description">{recipe.description.substring(0, 100)}...</p>
          <div className="recipe-meta">
            <span className="rating">⭐ {recipe.rating.average || 'N/A'}</span>
            <span className="views">{recipe.views} views</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RecipeCard;
