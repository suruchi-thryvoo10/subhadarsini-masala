import { Request, Response, NextFunction } from 'express';
import { Review } from '../models/Review.js';
import { Product } from '../models/Product.js';
import { AuthRequest } from '../types/index.js';
import { AppError } from '../middlewares/errorHandler.js';

export const getProductReviews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({ productId, status: 'APPROVED' }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: reviews
    });
  } catch (error) {
    next(error);
  }
};

export const submitReview = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new AppError('Authentication required to submit review', 401, 'UNAUTHORIZED');
    const { productId, rating, title, comment, images } = req.body;

    if (!productId || !rating || !title || !comment) {
      throw new AppError('Please provide rating, title, and review comment', 400, 'MISSING_FIELDS');
    }

    const review = await Review.create({
      product: productId,
      user: req.user.id,
      userName: req.user.name,
      userEmail: req.user.email,
      rating: Number(rating),
      title,
      comment,
      images: images || [],
      isVerifiedPurchase: true,
      status: 'APPROVED' // Auto-approve for verified customer demo
    });

    // Update product rating summary
    const stats = await Review.aggregate([
      { $match: { product: review.product, status: 'APPROVED' } },
      { $group: { _id: '$product', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } }
    ]);

    if (stats.length > 0) {
      await Product.findByIdAndUpdate(productId, {
        ratingAvg: Math.round(stats[0].avgRating * 10) / 10,
        ratingCount: stats[0].count
      });
    }

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data: review
    });
  } catch (error) {
    next(error);
  }
};
