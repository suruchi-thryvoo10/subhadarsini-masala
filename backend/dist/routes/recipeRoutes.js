import { Router } from 'express';
import { getRecipes, getRecipeBySlug, generateAIRecipes, submitRecipe } from '../controllers/recipeController.js';
const router = Router();
router.get('/', getRecipes);
router.get('/:slug', getRecipeBySlug);
router.post('/ai-assistant', generateAIRecipes);
router.post('/submit', submitRecipe);
export default router;
