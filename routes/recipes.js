const express = require('express');
const router = express.Router();
const {
  createRecipe,
  getAllRecipes,
  updateRecipe,
  deleteRecipe,
} = require('../controllers/recipes');

const authMiddleware = require('../middleware/authentication');

router.route('/').post(authMiddleware, createRecipe).get(authMiddleware, getAllRecipes);
router.route('/:id').patch(authMiddleware, updateRecipe).delete(authMiddleware, deleteRecipe);

module.exports = router;
