import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';
import { InventoryTransaction } from '../models/InventoryTransaction.js';
import { AppError } from '../middlewares/errorHandler.js';
export const createOrder = async (req, res, next) => {
    try {
        const { items, shippingAddress, paymentMethod, guestEmail } = req.body;
        if (!items || !items.length) {
            throw new AppError('Order must contain at least one item', 400, 'EMPTY_ORDER');
        }
        let subtotal = 0;
        const validatedItems = [];
        for (const item of items) {
            const product = await Product.findById(item.productId);
            if (!product || !product.isPublished) {
                throw new AppError(`Product not found or unavailable: ${item.name}`, 400, 'PRODUCT_UNAVAILABLE');
            }
            const variant = product.variants.find((v) => v.size === item.variantSize || v.sku === item.sku);
            const unitPrice = variant ? (variant.discountPrice || variant.price) : item.unitPrice;
            const itemTotal = unitPrice * item.quantity;
            subtotal += itemTotal;
            validatedItems.push({
                product: product._id,
                name: product.name,
                sku: variant?.sku || `SKU-${product._id}-${item.variantSize}`,
                variantSize: item.variantSize,
                quantity: item.quantity,
                unitPrice,
                totalPrice: itemTotal,
                image: product.images[0]
            });
            // Stock reduction logic
            if (variant) {
                variant.stock = Math.max(0, variant.stock - item.quantity);
                await product.save();
                await InventoryTransaction.create({
                    sku: variant.sku,
                    type: 'ORDER_RESERVED',
                    quantity: -item.quantity,
                    reason: `Customer order reservation`
                });
            }
        }
        const shippingFee = subtotal > 499 ? 0 : 49;
        const tax = Math.round(subtotal * 0.05); // 5% GST
        const totalAmount = subtotal + shippingFee + tax;
        const orderNumber = `SD-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
        const newOrder = await Order.create({
            orderNumber,
            user: req.user?.id || undefined,
            guestEmail: req.user ? undefined : guestEmail,
            items: validatedItems,
            shippingAddress,
            paymentInfo: {
                method: paymentMethod || 'UPI',
                status: paymentMethod === 'COD' ? 'PENDING' : 'PAID',
                razorpayOrderId: `rzp_order_${Date.now()}`,
                razorpayPaymentId: paymentMethod === 'COD' ? undefined : `rzp_pay_${Date.now()}`
            },
            pricing: {
                subtotal,
                shippingFee,
                tax,
                discount: 0,
                totalAmount
            },
            orderStatus: 'CONFIRMED',
            trackingHistory: [
                { status: 'PENDING', note: 'Order initiated by customer' },
                { status: 'CONFIRMED', note: 'Payment verified & order confirmed' }
            ]
        });
        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            data: newOrder
        });
    }
    catch (error) {
        next(error);
    }
};
export const trackOrder = async (req, res, next) => {
    try {
        const { orderNumber } = req.params;
        const order = await Order.findOne({ orderNumber }).select('-user');
        if (!order) {
            throw new AppError('Order not found with this order number', 404, 'ORDER_NOT_FOUND');
        }
        res.status(200).json({
            success: true,
            data: order
        });
    }
    catch (error) {
        next(error);
    }
};
export const getMyOrders = async (req, res, next) => {
    try {
        if (!req.user)
            throw new AppError('Not authenticated', 401, 'UNAUTHORIZED');
        const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            data: orders
        });
    }
    catch (error) {
        next(error);
    }
};
