import { Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { z } from 'zod';
import { User } from '../models/User.js';
import { Product } from '../models/Product.js';
import { AppError } from '../middlewares/errorHandler.js';
import { AuthRequest } from '../types/index.js';

/**
 * The signed-in user's wishlist, stored on their User document.
 *
 * Every handler reads the user id from the verified JWT (`req.user.id`) and
 * never from the URL or body, so a user can only ever read or change their
 * own list. Writes use `$addToSet` / `$pull`, which makes each of them
 * idempotent: adding a product twice, removing one that is not there, or
 * replaying a guest merge after a network retry all leave the same result.
 */

/** Same projection the catalogue listing uses, so cards render identically. */
const CARD_FIELDS =
  'name slug category shortDescription images variants isFeatured isUpcoming ratingAvg ratingCount';

/** Upper bound on one list, and on one merge request. */
const MAX_WISHLIST = 200;

const objectId = z.string().refine((v) => mongoose.isValidObjectId(v), 'Invalid product id');

// Malformed ids are filtered out (and reported as ignored) rather than failing
// validation: guest data comes from localStorage, and one bad entry must not
// make the whole merge fail on every retry.
const mergeSchema = z.object({
  productIds: z.array(z.string()).max(MAX_WISHLIST, `At most ${MAX_WISHLIST} products per merge`)
});

const requireUserId = (req: AuthRequest): string => {
  if (!req.user) throw new AppError('Not authenticated', 401, 'UNAUTHORIZED');
  return req.user.id;
};

/**
 * Loads the wishlist as card-ready products, newest additions last (the order
 * they were saved). References to products that no longer exist are dropped
 * from the response and pruned from the document.
 */
const loadWishlist = async (userId: string) => {
  const user = await User.findById(userId).select('wishlist').lean();
  if (!user) throw new AppError('User account not found', 404, 'USER_NOT_FOUND');

  const ids = (user.wishlist || []).map(String);
  if (ids.length === 0) return [];

  const products = await Product.find({ _id: { $in: ids } })
    .select(CARD_FIELDS)
    .populate('category', 'name slug')
    .lean();

  const byId = new Map(products.map((p: any) => [String(p._id), p]));
  const missing = ids.filter((id) => !byId.has(id));
  if (missing.length) {
    await User.updateOne({ _id: userId }, { $pull: { wishlist: { $in: missing } } });
  }

  return ids.map((id) => byId.get(id)).filter(Boolean);
};

/** Keeps only ids that point at real products, preserving the caller's order. */
const existingProductIds = async (ids: string[]): Promise<string[]> => {
  if (ids.length === 0) return [];
  const found = await Product.find({ _id: { $in: ids } }).select('_id').lean();
  const known = new Set(found.map((p: any) => String(p._id)));
  return ids.filter((id) => known.has(id));
};

const assertRoom = async (userId: string, adding: number) => {
  const user = await User.findById(userId).select('wishlist').lean();
  if (!user) throw new AppError('User account not found', 404, 'USER_NOT_FOUND');
  if ((user.wishlist?.length || 0) + adding > MAX_WISHLIST) {
    throw new AppError(`A wishlist can hold at most ${MAX_WISHLIST} products`, 400, 'WISHLIST_FULL');
  }
};

export const getWishlist = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data = await loadWishlist(requireUserId(req));
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const addToWishlist = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = requireUserId(req);
    const productId = objectId.parse(req.params.productId);

    const [exists] = await existingProductIds([productId]);
    if (!exists) throw new AppError('Product not found', 404, 'PRODUCT_NOT_FOUND');

    await assertRoom(userId, 1);
    await User.updateOne({ _id: userId }, { $addToSet: { wishlist: productId } });

    const data = await loadWishlist(userId);
    res.status(200).json({ success: true, data });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new AppError(error.errors[0].message, 400, 'VALIDATION_ERROR'));
    }
    next(error);
  }
};

export const removeFromWishlist = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = requireUserId(req);
    const productId = objectId.parse(req.params.productId);

    const result = await User.updateOne({ _id: userId }, { $pull: { wishlist: productId } });
    if (result.matchedCount === 0) throw new AppError('User account not found', 404, 'USER_NOT_FOUND');

    const data = await loadWishlist(userId);
    res.status(200).json({ success: true, data });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new AppError(error.errors[0].message, 400, 'VALIDATION_ERROR'));
    }
    next(error);
  }
};

/**
 * Folds a guest's locally saved wishlist into the account after sign-in.
 *
 * Idempotent by construction: `$addToSet` with `$each` never inserts an id the
 * list already holds, so the client can safely resend the same payload after a
 * timeout without creating duplicates. Ids for products that do not exist are
 * reported back as `ignored` rather than failing the whole merge, so one stale
 * entry cannot block the rest from syncing forever.
 */
export const mergeWishlist = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = requireUserId(req);
    const { productIds } = mergeSchema.parse(req.body);

    const unique = [...new Set(productIds)];
    const valid = await existingProductIds(unique.filter((id) => mongoose.isValidObjectId(id)));

    if (valid.length) {
      const user = await User.findById(userId).select('wishlist').lean();
      if (!user) throw new AppError('User account not found', 404, 'USER_NOT_FOUND');
      const current = new Set((user.wishlist || []).map(String));
      const room = Math.max(MAX_WISHLIST - current.size, 0);
      const toAdd = valid.filter((id) => !current.has(id)).slice(0, room);
      if (toAdd.length) {
        await User.updateOne({ _id: userId }, { $addToSet: { wishlist: { $each: toAdd } } });
      }
    }

    const data = await loadWishlist(userId);
    res.status(200).json({
      success: true,
      data,
      meta: {
        received: unique.length,
        ignored: unique.filter((id) => !valid.includes(id))
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new AppError(error.errors[0].message, 400, 'VALIDATION_ERROR'));
    }
    next(error);
  }
};
