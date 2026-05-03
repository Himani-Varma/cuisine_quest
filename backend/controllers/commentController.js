const Comment = require('../models/Comment');
const Recipe = require('../models/Recipe');

const addComment = async (req, res) => {
  try {
    const { text, rating } = req.body;
    const { recipeId } = req.params;

    if (!text || !rating) {
      return res.status(400).json({ message: 'Please provide text and rating' });
    }

    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    const comment = await Comment.create({
      text,
      rating,
      author: req.user.id,
      recipe: recipeId,
    });

    recipe.comments.push(comment._id);

    const totalRating = recipe.rating.count * recipe.rating.average + rating;
    recipe.rating.count += 1;
    recipe.rating.average = (totalRating / recipe.rating.count).toFixed(2);

    await recipe.save();

    await comment.populate('author', 'username profileImage');
    res.status(201).json({ comment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    const recipe = await Recipe.findById(comment.recipe);

    const totalRating = recipe.rating.count * recipe.rating.average - comment.rating;
    recipe.rating.count -= 1;
    recipe.rating.average = recipe.rating.count > 0 ? (totalRating / recipe.rating.count).toFixed(2) : 0;

    recipe.comments = recipe.comments.filter((id) => id.toString() !== commentId);
    await recipe.save();

    await Comment.findByIdAndDelete(commentId);
    res.status(200).json({ message: 'Comment deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addComment, deleteComment };
