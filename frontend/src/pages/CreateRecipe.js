import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { recipeAPI } from '../api';
import './RecipeForm.css';

const CreateRecipe = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    ingredients: [''],
    steps: [''],
    cuisine: 'Indian',
    category: 'Veg',
    difficulty: 'Easy',
    cookingTime: '',
    servings: '',
    image: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleIngredientChange = (index, value) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index] = value;
    setFormData((prev) => ({ ...prev, ingredients: newIngredients }));
  };

  const addIngredient = () => {
    setFormData((prev) => ({ ...prev, ingredients: [...prev.ingredients, ''] }));
  };

  const removeIngredient = (index) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
    }));
  };

  const handleStepChange = (index, value) => {
    const newSteps = [...formData.steps];
    newSteps[index] = value;
    setFormData((prev) => ({ ...prev, steps: newSteps }));
  };

  const addStep = () => {
    setFormData((prev) => ({ ...prev, steps: [...prev.steps, ''] }));
  };

  const removeStep = (index) => {
    setFormData((prev) => ({
      ...prev,
      steps: prev.steps.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title || !formData.description || !formData.image) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('ingredients', JSON.stringify(formData.ingredients.filter((i) => i)));
      data.append('steps', JSON.stringify(formData.steps.filter((s) => s)));
      data.append('cuisine', formData.cuisine);
      data.append('category', formData.category);
      data.append('difficulty', formData.difficulty);
      data.append('cookingTime', formData.cookingTime);
      data.append('servings', formData.servings);
      data.append('image', formData.image);

      await recipeAPI.createRecipe(data);
      navigate('/profile?refresh=' + Date.now());
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating recipe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="recipe-form-container">
      <div className="recipe-form">
        <h2>Create New Recipe</h2>
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Recipe Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              required
            ></textarea>
          </div>

          <div className="form-group">
            <label>Recipe Image *</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Cuisine</label>
              <select name="cuisine" value={formData.cuisine} onChange={handleChange}>
                <option>Indian</option>
                <option>Italian</option>
                <option>Chinese</option>
                <option>Mexican</option>
                <option>Thai</option>
                <option>Japanese</option>
                <option>American</option>
                <option>Mediterranean</option>
                <option>Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Category</label>
              <select name="category" value={formData.category} onChange={handleChange}>
                <option>Veg</option>
                <option>Non-Veg</option>
                <option>Dessert</option>
                <option>Beverage</option>
              </select>
            </div>

            <div className="form-group">
              <label>Difficulty</label>
              <select name="difficulty" value={formData.difficulty} onChange={handleChange}>
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Cooking Time (minutes)</label>
              <input
                type="number"
                name="cookingTime"
                value={formData.cookingTime}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Servings</label>
              <input
                type="number"
                name="servings"
                value={formData.servings}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Ingredients</label>
            {formData.ingredients.map((ingredient, index) => (
              <div key={index} className="ingredient-input">
                <input
                  type="text"
                  value={ingredient}
                  onChange={(e) => handleIngredientChange(index, e.target.value)}
                  placeholder="Enter ingredient"
                />
                {formData.ingredients.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeIngredient(index)}
                    className="remove-btn"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={addIngredient} className="add-btn">
              Add Ingredient
            </button>
          </div>

          <div className="form-group">
            <label>Cooking Steps</label>
            {formData.steps.map((step, index) => (
              <div key={index} className="step-input">
                <textarea
                  value={step}
                  onChange={(e) => handleStepChange(index, e.target.value)}
                  placeholder="Enter step"
                  rows="2"
                ></textarea>
                {formData.steps.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeStep(index)}
                    className="remove-btn"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={addStep} className="add-btn">
              Add Step
            </button>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Creating Recipe...' : 'Create Recipe'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateRecipe;
