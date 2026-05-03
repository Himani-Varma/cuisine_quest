const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    ingredients: [
      {
        type: String,
        required: true,
      },
    ],
    steps: [
      {
        type: String,
        required: true,
      },
    ],
    cuisine: {
      type: String,
      required: true,
      enum: ['Indian', 'Italian', 'Chinese', 'Mexican', 'Thai', 'Japanese', 'American', 'Mediterranean', 'Other'],
    },
    category: {
      type: String,
      required: true,
      enum: ['Veg', 'Non-Veg', 'Dessert', 'Beverage'],
    },
    difficulty: {
      type: String,
      required: true,
      enum: ['Easy', 'Medium', 'Hard'],
    },
    cookingTime: {
      type: Number,
      required: true,
    },
    servings: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rating: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      count: {
        type: Number,
        default: 0,
      },
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Recipe', recipeSchema);
