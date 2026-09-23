import { Request, Response, NextFunction } from 'express';
import { Recipe } from '../models/Recipe.js';
import { Product } from '../models/Product.js';
import { AppError } from '../middlewares/errorHandler.js';
import { z } from 'zod';

export const getRecipes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category, search } = req.query;

    // Only reviewed recipes are ever public; community submissions stay hidden
    // until an administrator approves them.
    const query: any = { status: 'APPROVED' };

    if (category) query.category = String(category);
    if (search) {
      query.$or = [
        { title: { $regex: String(search), $options: 'i' } },
        { description: { $regex: String(search), $options: 'i' } }
      ];
    }

    const recipes = await Recipe.find(query)
      .populate('requiredProducts', 'name slug images variants')
      .populate('heroProduct', 'name slug images')
      .sort({ isFeatured: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      data: recipes
    });
  } catch (error) {
    next(error);
  }
};

export const getRecipeBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;
    const recipe = await Recipe.findOne({ slug, status: 'APPROVED' })
      .populate('requiredProducts')
      .populate('heroProduct', 'name slug images');

    if (!recipe) {
      throw new AppError('Recipe not found', 404, 'RECIPE_NOT_FOUND');
    }

    res.status(200).json({
      success: true,
      data: recipe
    });
  } catch (error) {
    next(error);
  }
};

export const generateAIRecipes = async (req: Request, res: Response, next: NextFunction) => {
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
  } catch (error) {
    next(error);
  }
};


/** Roughly 700KB of base64 — enough for a downscaled phone photo, not an album. */
const MAX_DATA_URL = 700_000;

const submissionSchema = z.object({
  name: z.string().trim().min(2, 'Your name is required'),
  email: z.string().trim().email('Enter a valid email address'),
  phone: z.string().trim().optional().or(z.literal('')),
  title: z.string().trim().min(3, 'Recipe name is required'),
  description: z.string().trim().min(10, 'Tell us a little about the dish'),
  ingredients: z.string().trim().min(5, 'List at least one ingredient'),
  instructions: z.string().trim().min(10, 'Cooking steps are required'),
  heroProduct: z.string().trim().optional().or(z.literal('')),
  image: z.string().trim().max(MAX_DATA_URL, 'Image is too large — please use a smaller photo').optional().or(z.literal('')),
  videoUrl: z.string().trim().url('Enter a valid video link').optional().or(z.literal(''))
});

/** Split a textarea into trimmed, non-empty lines. */
const splitLines = (value: string): string[] =>
  value
    .split('\n')
    .map((line) => line.replace('\r', '').trim())
    .filter(Boolean);

const slugify = (value: string) =>
  value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 70);

/**
 * Community recipe submission.
 *
 * Saved as PENDING and excluded from every public read, so nothing a visitor
 * submits can appear on the site until an administrator approves it.
 */
export const submitRecipe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = submissionSchema.parse(req.body);

    const baseSlug = slugify(data.title) || 'community-recipe';
    let slug = baseSlug;
    let suffix = 2;
    while (await Recipe.exists({ slug })) {
      slug = `${baseSlug}-${suffix++}`;
    }

    const heroProduct = data.heroProduct && (await Product.findOne({ slug: data.heroProduct }).select('_id'));

    await Recipe.create({
      title: data.title,
      slug,
      category: 'Community',
      description: data.description,
      image: data.image || '',
      ingredients: splitLines(data.ingredients).map((line) => ({ name: line, quantity: '' })),
      instructions: splitLines(data.instructions),
      heroProduct: heroProduct ? heroProduct._id : undefined,
      videoUrl: data.videoUrl || undefined,
      source: 'COMMUNITY',
      status: 'PENDING',
      isFeatured: false,
      submittedBy: { name: data.name, email: data.email, phone: data.phone || undefined }
    });

    res.status(201).json({
      success: true,
      message:
        'Thank you! Your recipe has been sent to our kitchen team for review. We will be in touch before it is published.'
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return next(new AppError(error.errors[0].message, 400, 'VALIDATION_ERROR'));
    }
    next(error);
  }
};
