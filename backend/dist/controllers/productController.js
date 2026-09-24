import { Product } from '../models/Product.js';
import { Category } from '../models/Category.js';
import { AppError } from '../middlewares/errorHandler.js';
import { cacheKey, cached, invalidateNamespaces, TTL } from '../utils/redisCache.js';
/**
 * Fields a card needs. Listing endpoints project to these so a 25-product page
 * does not ship full descriptions, nutrition tables and manufacturer strings
 * that nothing on screen reads.
 */
const LIST_FIELDS = 'name slug category shortDescription images variants isFeatured isUpcoming ratingAvg ratingCount';
export const getProducts = async (req, res, next) => {
    try {
        const { category, search, minPrice, maxPrice, minRating, sort, page = 1, limit = 12 } = req.query;
        const pageNum = Math.max(1, Number(page) || 1);
        const limitNum = Math.min(100, Math.max(1, Number(limit) || 12));
        const key = cacheKey('products', {
            category: String(category || ''),
            search: String(search || ''),
            minPrice: String(minPrice || ''),
            maxPrice: String(maxPrice || ''),
            minRating: String(minRating || ''),
            sort: String(sort || ''),
            page: pageNum,
            limit: limitNum
        });
        const payload = await cached(key, TTL.products, async () => {
            const query = { isPublished: true };
            if (category) {
                const categoryDoc = await Category.findOne({ slug: String(category) }).select('_id').lean();
                // An unknown slug must return nothing rather than the whole catalogue.
                query.category = categoryDoc ? categoryDoc._id : null;
            }
            if (search) {
                const term = String(search);
                query.$or = [
                    { name: { $regex: term, $options: 'i' } },
                    { shortDescription: { $regex: term, $options: 'i' } },
                    { ingredients: { $regex: term, $options: 'i' } }
                ];
            }
            if (minRating)
                query.ratingAvg = { $gte: Number(minRating) };
            // Price lives on the variants, so filter on the cheapest variant's price.
            if (minPrice || maxPrice) {
                const price = {};
                if (minPrice)
                    price.$gte = Number(minPrice);
                if (maxPrice)
                    price.$lte = Number(maxPrice);
                query['variants.price'] = price;
            }
            let sortOptions = { isFeatured: -1, createdAt: -1 };
            if (sort === 'price-low')
                sortOptions = { 'variants.0.price': 1 };
            if (sort === 'price-high')
                sortOptions = { 'variants.0.price': -1 };
            if (sort === 'rating')
                sortOptions = { ratingAvg: -1 };
            if (sort === 'newest')
                sortOptions = { createdAt: -1 };
            const [products, total] = await Promise.all([
                Product.find(query)
                    .select(LIST_FIELDS)
                    .sort(sortOptions)
                    .skip((pageNum - 1) * limitNum)
                    .limit(limitNum)
                    .populate('category', 'name slug')
                    .lean(),
                Product.countDocuments(query)
            ]);
            return {
                success: true,
                data: products,
                meta: { total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) }
            };
        });
        res.status(200).json(payload);
    }
    catch (error) {
        next(error);
    }
};
export const getProductBySlug = async (req, res, next) => {
    try {
        const { slug } = req.params;
        const key = cacheKey('products', `detail:${slug}`);
        const payload = await cached(key, TTL.products, async () => {
            const product = await Product.findOne({ slug, isPublished: true })
                .populate('category', 'name slug')
                .lean();
            if (!product) {
                throw new AppError('Product not found with this slug', 404, 'PRODUCT_NOT_FOUND');
            }
            const relatedProducts = await Product.find({
                category: product.category?._id ?? product.category,
                _id: { $ne: product._id },
                isPublished: true
            })
                .select(LIST_FIELDS)
                .populate('category', 'name slug')
                .limit(4)
                .lean();
            return { success: true, data: { product, relatedProducts } };
        });
        res.status(200).json(payload);
    }
    catch (error) {
        next(error);
    }
};
/** Called after any admin write so the next read rebuilds from MongoDB. */
export const invalidateProductCaches = () => invalidateNamespaces('products', 'categories', 'stats');
