import { Request, Response, NextFunction } from 'express';
import { Category } from '../models/Category.js';
import { getCache, setCache } from '../utils/redisCache.js';

export const getCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cacheKey = 'categories:all';
    const cachedData = await getCache(cacheKey);
    if (cachedData) return res.status(200).json(cachedData);

    const categories = await Category.find({ isActive: true }).sort({ sortOrder: 1 });

    const responsePayload = {
      success: true,
      data: categories
    };

    await setCache(cacheKey, responsePayload, 1800);
    res.status(200).json(responsePayload);
  } catch (error) {
    next(error);
  }
};
