import { Request, Response, NextFunction } from 'express';
import { Category } from '../models/Category.js';
import { Product } from '../models/Product.js';
import { AppError } from '../middlewares/errorHandler.js';
import { cacheKey, cached, TTL } from '../utils/redisCache.js';

export const getCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const key = cacheKey('categories', 'all');
    const payload = await cached(key, TTL.categories, async () => {
    const categories = await Category.find({ isActive: true }).sort({ sortOrder: 1 }).lean();

    // A category with no published products would render as an empty shelf, so
    // it is left out until something is listed under it.
    const counts = await Product.aggregate([
      { $match: { isPublished: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    const countBy = new Map(counts.map((c) => [String(c._id), c.count]));

      return {
        success: true,
        data: categories
          .filter((c) => (countBy.get(String(c._id)) || 0) > 0)
          .map((c) => ({ ...c, productCount: countBy.get(String(c._id)) || 0 }))
      };
    });

    res.status(200).json(payload);
  } catch (error) {
    next(error);
  }
};

/**
 * Single category plus its products — backs the category landing pages.
 * Returned in one round trip so the page can render its hero and grid together.
 */
export const getCategoryBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;
    const key = cacheKey('categories', `detail:${slug}`);

    const payload = await cached(key, TTL.categories, async () => {
    const category = await Category.findOne({ slug, isActive: true }).lean();
    if (!category) {
      throw new AppError('No category found with this slug', 404, 'CATEGORY_NOT_FOUND');
    }

    // Siblings ship with the response so the page needs one request, not two.
    const [products, siblings] = await Promise.all([
      Product.find({ category: category._id, isPublished: true })
        .select('name slug category shortDescription images variants isFeatured isUpcoming ratingAvg ratingCount')
        .sort({ isFeatured: -1, createdAt: -1 })
        .populate('category', 'name slug')
        .lean(),
      Category.find({ isActive: true }).select('name slug sortOrder').sort({ sortOrder: 1 }).lean()
    ]);

      return {
        success: true,
        data: { category, products, siblings, meta: { total: products.length } }
      };
    });

    res.status(200).json(payload);
  } catch (error) {
    next(error);
  }
};
