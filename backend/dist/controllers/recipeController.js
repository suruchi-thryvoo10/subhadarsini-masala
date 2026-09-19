import { Recipe } from '../models/Recipe.js';
import { Product } from '../models/Product.js';
import { AppError } from '../middlewares/errorHandler.js';
export const getRecipes = async (req, res, next) => {
    try {
        const { category, search } = req.query;
        const query = {};
        if (category)
            query.category = String(category);
        if (search) {
            query.$or = [
                { title: { $regex: String(search), $options: 'i' } },
                { description: { $regex: String(search), $options: 'i' } }
            ];
        }
        const recipes = await Recipe.find(query).populate('requiredProducts', 'name slug images variants');
        res.status(200).json({
            success: true,
            data: recipes
        });
    }
    catch (error) {
        next(error);
    }
};
export const getRecipeBySlug = async (req, res, next) => {
    try {
        const { slug } = req.params;
        const recipe = await Recipe.findOne({ slug }).populate('requiredProducts');
        if (!recipe) {
            throw new AppError('Recipe not found', 404, 'RECIPE_NOT_FOUND');
        }
        res.status(200).json({
            success: true,
            data: recipe
        });
    }
    catch (error) {
        next(error);
    }
};
export const generateAIRecipes = async (req, res, next) => {
    try {
        const { ingredients } = req.body; // e.g. "chicken, onion, tomato, garlic"
        if (!ingredients || typeof ingredients !== 'string') {
            throw new AppError('Please provide ingredients list string', 400, 'INVALID_INGREDIENTS');
        }
        const products = await Product.find({ isPublished: true }).select('name slug images variants shortDescription');
        const inputLower = ingredients.toLowerCase();
        const suggestedRecipes = [];
        if (inputLower.includes('chicken') || inputLower.includes('mutton') || inputLower.includes('meat')) {
            const chickenMasala = products.find(p => p.name.toLowerCase().includes('chicken') || p.name.toLowerCase().includes('meat'));
            const chilli = products.find(p => p.name.toLowerCase().includes('chilli') || p.name.toLowerCase().includes('red'));
            const turmeric = products.find(p => p.name.toLowerCase().includes('turmeric'));
            suggestedRecipes.push({
                title: 'Authentic Subhadarshini Special Curry',
                cookingTime: '35 mins',
                difficulty: 'Medium',
                description: 'A rich, fragrant curry prepared with roasted aromatic ground spices.',
                suggestedProducts: [chickenMasala, turmeric, chilli].filter(Boolean),
                instructions: [
                    'Marinate the meat with turmeric, red chilli powder, and salt for 15 mins.',
                    'Heat mustard oil in a heavy-bottomed handi and sauté sliced onions till golden brown.',
                    'Add ginger-garlic paste and tomatoes, cooking until oil separates.',
                    'Add 2 tbsp of Subhadarshini Special Masala and stir on low heat.',
                    'Add meat, simmer with 1 cup water until tender, and serve hot with steamed rice.'
                ]
            });
        }
        // Default vegetarian recipe recommendation
        const garamMasala = products.find(p => p.name.toLowerCase().includes('garam') || p.name.toLowerCase().includes('blended'));
        const cumin = products.find(p => p.name.toLowerCase().includes('cumin') || p.name.toLowerCase().includes('jeera'));
        const turmeric = products.find(p => p.name.toLowerCase().includes('turmeric'));
        suggestedRecipes.push({
            title: 'Homestyle Spiced Veggie Stir-Fry',
            cookingTime: '20 mins',
            difficulty: 'Easy',
            description: 'Quick & healthy vegetable dish enhanced with pure stone-ground spices.',
            suggestedProducts: [garamMasala, cumin, turmeric].filter(Boolean),
            instructions: [
                'Crackle Subhadarshini Cumin Seeds in hot ghee.',
                'Sauté chopped veggies of choice with Subhadarshini Pure Turmeric Powder.',
                'Sprinkle Subhadarshini Special Garam Masala right before finishing.',
                'Garnish with fresh coriander leaves.'
            ]
        });
        res.status(200).json({
            success: true,
            isAiGenerated: true,
            notice: 'AI suggestions are generated using verified Subhadarshini product recipes.',
            data: suggestedRecipes
        });
    }
    catch (error) {
        next(error);
    }
};
