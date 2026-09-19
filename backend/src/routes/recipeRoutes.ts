import { Router } from 'express';
import { getRecipes, getRecipeBySlug, generateAIRecipes } from '../controllers/recipeController.js';

const router = Router();

router.get('/', getRecipes);
router.get('/:slug', getRecipeBySlug);
router.post('/ai-assistant', generateAIRecipes);

export default router;
