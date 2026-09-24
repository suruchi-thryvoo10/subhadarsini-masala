import { Request, Response, NextFunction } from 'express';
import { Product } from '../models/Product.js';
import { Category } from '../models/Category.js';
import { Batch } from '../models/Batch.js';
import { Review } from '../models/Review.js';
import { cacheKey, cached, TTL } from '../utils/redisCache.js';

/**
 * Public, real catalogue figures for the storefront.
 *
 * Every value here is counted or aggregated from the database — nothing is a
 * marketing estimate, so the numbers on the homepage can never drift away from
 * what the catalogue actually contains.
 */
export const getPublicStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const key = cacheKey('stats', 'public');
    const payload = await cached(key, TTL.stats, async () => {
    // The average is taken from the Review collection, not from the products'
    // seeded ratingAvg field — otherwise the site would advertise an average
    // built from numbers no customer ever submitted.
    const [products, categories, verifiedBatches, totalReviews, ratingAgg] = await Promise.all([
      Product.countDocuments({ isPublished: true }),
      Category.countDocuments({ isActive: true }),
      Batch.countDocuments({ isVerified: true }),
      Review.countDocuments(),
      Review.aggregate([{ $group: { _id: null, avg: { $avg: '$rating' } } }])
    ]);

      return {
      success: true,
      data: {
        products,
        categories,
        verifiedBatches,
        averageRating: ratingAgg[0]?.avg ? Number(ratingAgg[0].avg.toFixed(1)) : null,
        totalReviews
      }
      };
    });

    res.status(200).json(payload);
  } catch (error) {
    next(error);
  }
};
