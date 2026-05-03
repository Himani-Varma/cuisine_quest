import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { recipeAPI, commentAPI } from '../api';
import useAuth from '../hooks/useAuth';
import './RecipeDetails.css';

const RecipeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [commentText, setCommentText] = useState('');
  const [rating, setRating] = useState(5);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [shareMessage, setShareMessage] = useState('');

  useEffect(() => {
    const loadRecipe = async () => {
      try {
        if (!id) {
          setError('Invalid recipe ID');
          setLoading(false);
          return;
        }
        
        const { data } = await recipeAPI.getRecipeById(id);
        setRecipe(data.recipe);
      } catch (err) {
        setError('Failed to load recipe');
      } finally {
        setLoading(false);
      }
    };

    loadRecipe();
  }, [id]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    if (!commentText.trim()) {
      setError('Please enter a comment');
      return;
    }

    setSubmittingComment(true);
    try {
      await commentAPI.addComment(id, { text: commentText, rating });
      setCommentText('');
      setRating(5);
      
      // Reload recipe to get updated comments
      const { data } = await recipeAPI.getRecipeById(id);
      setRecipe(data.recipe);
    } catch (err) {
      setError('Failed to add comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      await commentAPI.deleteComment(commentId);
      const { data } = await recipeAPI.getRecipeById(id);
      setRecipe(data.recipe);
    } catch (err) {
      setError('Failed to delete comment');
    }
  };

  const handleLike = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      const { data } = await recipeAPI.likeRecipe(id);
      setRecipe(data.recipe);
    } catch (err) {
      console.error('Error liking recipe:', err);
    }
  };

  const handleFavorite = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      await recipeAPI.addToFavorites(id);
    } catch (err) {
      console.error('Error adding to favorites:', err);
    }
  };

  const handleShare = async () => {
    if (!recipe) return;

    const shareText = `Check out "${recipe.title}" on CuisineQuest! ${window.location.href}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: recipe.title,
          text: `Check out this recipe: ${recipe.title}`,
          url: window.location.href,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(shareText);
      setShareMessage('Recipe link copied to clipboard!');
      setTimeout(() => setShareMessage(''), 3000);
    }
  };

  const handleDeleteRecipe = async () => {
    if (!window.confirm('Are you sure you want to delete this recipe? This action cannot be undone.')) return;

    try {
      await recipeAPI.deleteRecipe(id);
      navigate('/profile');
    } catch (err) {
      setError('Failed to delete recipe');
    }
  };

  if (loading) return <div className="loading">Loading recipe...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!recipe) return <div className="error-message">Recipe not found</div>;

  const isOwner = user && user.id === recipe.owner?._id;

  return (
    <div className="recipe-details-page">
      <div className="recipe-header">
        <button onClick={() => navigate(-1)} className="back-btn">Back</button>
        {isOwner && (
          <div className="owner-actions">
            <button onClick={() => navigate(`/edit/${id}`)} className="edit-btn">Edit</button>
            <button onClick={handleDeleteRecipe} className="delete-btn">Delete</button>
          </div>
        )}
      </div>

      <div className="recipe-container">
        <div className="recipe-image-section">
          <img src={recipe.image || "/placeholder.svg"} alt={recipe.title} className="recipe-image" />
          <div className="recipe-stats">
            <div className="stat">
              <span className="stat-label">Views</span>
              <span className="stat-value">{recipe.views}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Rating</span>
              <span className="stat-value">⭐ {recipe.rating.average || 'N/A'}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Ratings</span>
              <span className="stat-value">{recipe.rating.count}</span>
            </div>
          </div>
        </div>

        <div className="recipe-content">
          <h1>{recipe.title}</h1>
          
          <div className="recipe-meta">
            <span className="badge">{recipe.cuisine}</span>
            <span className="badge">{recipe.category}</span>
            <span className="badge">{recipe.difficulty}</span>
            <span className="badge">{recipe.cookingTime} mins</span>
            <span className="badge">Serves {recipe.servings}</span>
          </div>

          <div className="recipe-actions">
            <button onClick={handleLike} className="action-btn like">
              {recipe.likes.includes(user?.id) ? '❤' : '🤍'} Like ({recipe.likes.length})
            </button>
            <button onClick={handleFavorite} className="action-btn favorite">
              ⭐ Add to Favorites
            </button>
            <button onClick={handleShare} className="action-btn share">
              📤 Share
            </button>
          </div>

          {shareMessage && <p className="share-message">{shareMessage}</p>}

          <h2>Description</h2>
          <p>{recipe.description}</p>

          <div className="recipe-two-columns">
            <div>
              <h2>Ingredients</h2>
              <ul className="ingredients-list">
                {recipe.ingredients.map((ing, index) => (
                  <li key={index}>{ing}</li>
                ))}
              </ul>
            </div>

            <div>
              <h2>Steps</h2>
              <ol className="steps-list">
                {recipe.steps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </div>
          </div>

          <div className="author-info">
            <div className="author-avatar">{recipe.owner?.username?.[0]?.toUpperCase() || 'U'}</div>
            <div>
              <p className="author-name">{recipe.owner?.username || 'Unknown'}</p>
              <p className="author-bio">{recipe.owner?.bio || 'Recipe creator'}</p>
              {isOwner && <p className="author-owner-badge">Recipe Creator</p>}
            </div>
          </div>

          <div className="comments-section">
            <h2>Comments & Ratings</h2>

            {user && (
              <form onSubmit={handleAddComment} className="comment-form">
                <div className="form-group">
                  <label>Your Rating</label>
                  <select value={rating} onChange={(e) => setRating(e.target.value)}>
                    <option value="5">5 Stars - Excellent</option>
                    <option value="4">4 Stars - Good</option>
                    <option value="3">3 Stars - Average</option>
                    <option value="2">2 Stars - Poor</option>
                    <option value="1">1 Star - Very Poor</option>
                  </select>
                </div>
                <div className="form-group">
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Share your thoughts..."
                    rows="3"
                  ></textarea>
                </div>
                <button type="submit" className="submit-btn" disabled={submittingComment}>
                  {submittingComment ? 'Posting...' : 'Post Comment'}
                </button>
              </form>
            )}

            {!user && (
              <p className="login-prompt">
                <button onClick={() => navigate('/login')} className="link-btn">Login</button>
                {' '}to comment and rate this recipe.
              </p>
            )}

            <div className="comments-list">
              {recipe.comments && recipe.comments.length > 0 ? (
                recipe.comments.map((comment) => (
                  <div key={comment._id} className="comment-item">
                    <div className="comment-header">
                      <span className="comment-author">{comment.author.username}</span>
                      <span className="comment-rating">{'⭐'.repeat(comment.rating)}</span>
                    </div>
                    <p className="comment-text">{comment.text}</p>
                    {user && user.id === comment.author._id && (
                      <button
                        onClick={() => handleDeleteComment(comment._id)}
                        className="delete-comment-btn"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <p className="no-comments">No comments yet. Be the first to comment!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetails;
