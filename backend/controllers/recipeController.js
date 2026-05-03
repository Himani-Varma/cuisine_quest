const Recipe = require('../models/Recipe');
const User = require('../models/User');

const createRecipe = async (req, res) => {
  try {
    const { title, description, ingredients, steps, cuisine, category, difficulty, cookingTime, servings } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an image' });
    }

    const recipe = await Recipe.create({
      title,
      description,
      ingredients: JSON.parse(ingredients),
      steps: JSON.parse(steps),
      cuisine,
      category,
      difficulty,
      cookingTime,
      servings,
      image: req.file.path,
      owner: req.user.id,
    });

    res.status(201).json({ recipe });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllRecipes = async (req, res) => {
  try {
    const { search, cuisine, category, difficulty, sort } = req.query;
    let filter = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { ingredients: { $regex: search, $options: 'i' } },
      ];
    }

    if (cuisine) filter.cuisine = cuisine;
    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;

    let query = Recipe.find(filter).populate('owner', 'username profileImage').populate('comments');

    if (sort === 'newest') {
      query = query.sort({ createdAt: -1 });
    } else if (sort === 'oldest') {
      query = query.sort({ createdAt: 1 });
    } else if (sort === 'popular') {
      query = query.sort({ 'rating.count': -1 });
    } else if (sort === 'rated') {
      query = query.sort({ 'rating.average': -1 });
    }

    const recipes = await query;
    res.status(200).json({ recipes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    )
      .populate('owner', 'username profileImage bio')
      .populate({
        path: 'comments',
        populate: { path: 'author', select: 'username profileImage' },
      });

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    res.status(200).json({ recipe });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTrendingRecipes = async (req, res) => {
  try {
    const trending = await Recipe.find()
      .sort({ views: -1, 'rating.average': -1 })
      .limit(8)
      .populate('owner', 'username profileImage');

    res.status(200).json({ recipes: trending });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRecentRecipes = async (req, res) => {
  try {
    const recent = await Recipe.find()
      .sort({ createdAt: -1 })
      .limit(8)
      .populate('owner', 'username profileImage');

    res.status(200).json({ recipes: recent });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTopRatedRecipes = async (req, res) => {
  try {
    const topRated = await Recipe.find({ 'rating.count': { $gt: 0 } })
      .sort({ 'rating.average': -1 })
      .limit(8)
      .populate('owner', 'username profileImage');

    res.status(200).json({ recipes: topRated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    if (recipe.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this recipe' });
    }

    const { title, description, ingredients, steps, cuisine, category, difficulty, cookingTime, servings } = req.body;

    if (title) recipe.title = title;
    if (description) recipe.description = description;
    if (ingredients) recipe.ingredients = JSON.parse(ingredients);
    if (steps) recipe.steps = JSON.parse(steps);
    if (cuisine) recipe.cuisine = cuisine;
    if (category) recipe.category = category;
    if (difficulty) recipe.difficulty = difficulty;
    if (cookingTime) recipe.cookingTime = cookingTime;
    if (servings) recipe.servings = servings;
    if (req.file) recipe.image = req.file.path;

    await recipe.save();
    res.status(200).json({ recipe });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    if (recipe.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this recipe' });
    }

    await Recipe.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Recipe deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const likeRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    const alreadyLiked = recipe.likes.includes(req.user.id);

    if (alreadyLiked) {
      recipe.likes = recipe.likes.filter((id) => id.toString() !== req.user.id);
    } else {
      recipe.likes.push(req.user.id);
    }

    await recipe.save();
    res.status(200).json({ recipe });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addToFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    const alreadyFavorited = user.favoriteRecipes.includes(req.params.id);

    if (alreadyFavorited) {
      user.favoriteRecipes = user.favoriteRecipes.filter((id) => id.toString() !== req.params.id);
    } else {
      user.favoriteRecipes.push(req.params.id);
    }

    await user.save();
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserRecipes = async (req, res) => {
  try {
    const { userId } = req.params;

    const userRecipes = await Recipe.find({ owner: userId })
      .populate('owner', 'username profileImage')
      .populate('comments')
      .sort({ createdAt: -1 });

    res.status(200).json({ recipes: userRecipes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
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
};
