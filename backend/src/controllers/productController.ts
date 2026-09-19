import { Request, Response, NextFunction } from 'express';
import { Product } from '../models/Product.js';
import { Category } from '../models/Category.js';
import { AppError } from '../middlewares/errorHandler.js';
import { getCache, setCache, deleteCachePattern } from '../utils/redisCache.js';

export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category, search, minPrice, maxPrice, minRating, sort, page = 1, limit = 12 } = req.query;

    const cacheKey = `products:${JSON.stringify(req.query)}`;
    const cachedData = await getCache(cacheKey);
    if (cachedData) {
      return res.status(200).json(cachedData);
    }

    const query: any = { isPublished: true };

    if (category) {
      const categoryDoc = await Category.findOne({ slug: String(category) });
      if (categoryDoc) {
        query.category = categoryDoc._id;
      }
    }

    if (search) {
      query.$or = [
        { name: { $regex: String(search), $options: 'i' } },
        { shortDescription: { $regex: String(search), $options: 'i' } },
        { ingredients: { $regex: String(search), $options: 'i' } }
      ];
    }

    if (minRating) {
      query.ratingAvg = { $gte: Number(minRating) };
    }

    let sortOptions: any = { createdAt: -1 };
    if (sort === 'price-low') sortOptions = { 'variants.0.price': 1 };
    if (sort === 'price-high') sortOptions = { 'variants.0.price': -1 };
    if (sort === 'rating') sortOptions = { ratingAvg: -1 };
    if (sort === 'newest') sortOptions = { createdAt: -1 };
    if (sort === 'featured') sortOptions = { isFeatured: -1, createdAt: -1 };

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      Product.find(query).sort(sortOptions).skip(skip).limit(limitNum).populate('category', 'name slug'),
      Product.countDocuments(query)
    ]);

    const responsePayload = {
      success: true,
      data: products,
      meta: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum)
      }
    };

    await setCache(cacheKey, responsePayload, 300);
    res.status(200).json(responsePayload);
  } catch (error) {
    next(error);
  }
};

export const getProductBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;
    const cacheKey = `product:${slug}`;

    const cachedData = await getCache(cacheKey);
    if (cachedData) return res.status(200).json(cachedData);

    const product = await Product.findOne({ slug, isPublished: true }).populate('category', 'name slug');
    if (!product) {
      throw new AppError('Product not found with this slug', 404, 'PRODUCT_NOT_FOUND');
    }

    const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
      isPublished: true
    }).limit(4);

    const responsePayload = {
      success: true,
      data: {
        product,
        relatedProducts
      }
    };

    await setCache(cacheKey, responsePayload, 600);
    res.status(200).json(responsePayload);
  } catch (error) {
    next(error);
  }
};
