import { Category } from '../models/Category.js';
import { Product } from '../models/Product.js';
import { AppError } from '../middlewares/errorHandler.js';
import { getCache, setCache } from '../utils/redisCache.js';
export const getCategories = async (req, res, next) => {
    try {
        const cacheKey = 'categories:all';
        const cachedData = await getCache(cacheKey);
        if (cachedData)
            return res.status(200).json(cachedData);
        const categories = await Category.find({ isActive: true }).sort({ sortOrder: 1 });
        const responsePayload = {
            success: true,
            data: categories
        };
        await setCache(cacheKey, responsePayload, 1800);
        res.status(200).json(responsePayload);
    }
    catch (error) {
        next(error);
    }
};
/**
 * Single category plus its products — backs the category landing pages.
 * Returned in one round trip so the page can render its hero and grid together.
 */
export const getCategoryBySlug = async (req, res, next) => {
    try {
        const { slug } = req.params;
        const cacheKey = `category:${slug}`;
        const cachedData = await getCache(cacheKey);
        if (cachedData)
            return res.status(200).json(cachedData);
        const category = await Category.findOne({ slug, isActive: true });
        if (!category) {
            throw new AppError('No category found with this slug', 404, 'CATEGORY_NOT_FOUND');
        }
        const products = await Product.find({ category: category._id, isPublished: true })
            .sort({ isFeatured: -1, createdAt: -1 })
            .populate('category', 'name slug');
        const responsePayload = {
            success: true,
            data: {
                category,
                products,
                meta: { total: products.length }
            }
        };
        await setCache(cacheKey, responsePayload, 900);
        res.status(200).json(responsePayload);
    }
    catch (error) {
        next(error);
    }
};
