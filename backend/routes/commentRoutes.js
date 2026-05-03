const express = require('express');
const { addComment, deleteComment } = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/:recipeId', protect, addComment);
router.delete('/:commentId', protect, deleteComment);

module.exports = router;
