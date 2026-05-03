const express = require('express');
const {
  createRecipe,
  getAllRecipes,
  getRecipeById,
  getTrendingRecipes,
  getRecentRecipes,
  getTopRatedRecipes,
  updateRecipe,
  deleteRecipe,
  likeRecipe,
  addToFavorites,
  getUserRecipes,
} = require('../controllers/recipeController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.post('/', protect, upload.single('image'), createRecipe);
router.get('/', getAllRecipes);
router.get('/user/:userId', getUserRecipes);
router.get('/trending', getTrendingRecipes);
router.get('/recent', getRecentRecipes);
router.get('/toprated', getTopRatedRecipes);
router.get('/:id', getRecipeById);
router.put('/:id', protect, upload.single('image'), updateRecipe);
router.delete('/:id', protect, deleteRecipe);
router.post('/:id/like', protect, likeRecipe);
router.post('/:id/favorite', protect, addToFavorites);

module.exports = router;
