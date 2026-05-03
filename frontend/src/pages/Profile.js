import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { recipeAPI } from '../api';
import useAuth from '../hooks/useAuth';
import RecipeCard from '../components/RecipeCard';
import './Profile.css';

const Profile = () => {
  const { user } = useAuth();
  const [userRecipes, setUserRecipes] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('recipes');
  const location = useLocation();

  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true);
        if (!user?.id) {
          setLoading(false);
          return;
        }
        
        const { data } = await recipeAPI.getUserRecipes(user.id);
        setUserRecipes(data.recipes);

        const { data: userData } = await recipeAPI.getCurrentUser();
        setFavorites(userData.user?.favoriteRecipes || []);
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [user?.id, location.search]);

  if (loading) return <div className="loading">Loading profile...</div>;
  
  if (!user) {
    return <div className="loading">Loading user information...</div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-avatar">{user.username?.[0]?.toUpperCase() || 'U'}</div>
        <div className="profile-info">
          <h1>{user.username || 'User'}</h1>
          <p>{user.email || 'No email'}</p>
        </div>
      </div>

      <div className="profile-tabs">
        <button
          className={`tab-btn ${activeTab === 'recipes' ? 'active' : ''}`}
          onClick={() => setActiveTab('recipes')}
        >
          My Recipes ({userRecipes.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'favorites' ? 'active' : ''}`}
          onClick={() => setActiveTab('favorites')}
        >
          Favorites ({favorites.length})
        </button>
      </div>

      <div className="profile-content">
        {activeTab === 'recipes' && (
          <div>
            <Link to="/create" className="create-link">Create New Recipe</Link>
            {userRecipes.length > 0 ? (
              <div className="recipes-grid">
                {userRecipes.map((recipe) => (
                  <RecipeCard key={recipe._id} recipe={recipe} />
                ))}
              </div>
            ) : (
              <p className="empty-state">You haven't created any recipes yet. Create one now!</p>
            )}
          </div>
        )}

        {activeTab === 'favorites' && (
          <div>
            {favorites.length > 0 ? (
              <div className="recipes-grid">
                {favorites.map((recipe) => (
                  <RecipeCard key={recipe._id} recipe={recipe} />
                ))}
              </div>
            ) : (
              <p className="empty-state">You haven't favorited any recipes yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
