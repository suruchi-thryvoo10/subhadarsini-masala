import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/index.js';
import { Product } from '../models/Product.js';
import { Order } from '../models/Order.js';
import { User } from '../models/User.js';
import { Batch } from '../models/Batch.js';
import { Enquiry } from '../models/Enquiry.js';
import { AuditLog } from '../models/AuditLog.js';
import { AppError } from '../middlewares/errorHandler.js';
import { deleteCachePattern } from '../utils/redisCache.js';

export const getDashboardStats = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const [totalProducts, totalOrders, totalUsers, totalEnquiries] = await Promise.all([
      Product.countDocuments(),
      Order.countDocuments(),
      User.countDocuments({ role: 'CUSTOMER' }),
      Enquiry.countDocuments()
    ]);

    const revenueAggregation = await Order.aggregate([
      { $match: { 'paymentInfo.status': 'PAID' } },
      { $group: { _id: null, totalRevenue: { $sum: '$pricing.totalAmount' } } }
    ]);

    const totalRevenue = revenueAggregation[0]?.totalRevenue || 0;

    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5);

    const lowStockProducts = await Product.find({ 'variants.stock': { $lt: 30 } }).select('name variants images');

    res.status(200).json({
      success: true,
      data: {
        totalProducts,
        totalOrders,
        totalUsers,
        totalEnquiries,
        totalRevenue,
        recentOrders,
        lowStockProducts
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminProducts = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const products = await Product.find().populate('category', 'name slug').sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const productData = req.body;

    const product = await Product.create(productData);

    // Write to audit log
    if (req.user) {
      await AuditLog.create({
        user: req.user.id,
        userEmail: req.user.email,
        userRole: req.user.role,
        action: 'CREATE_PRODUCT',
        entity: 'Product',
        entityId: String(product._id),
        newValue: productData,
        ipAddress: req.ip
      });
    }

    await deleteCachePattern('products:*');

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const oldProduct = await Product.findById(id);

    if (!oldProduct) {
      throw new AppError('Product not found', 404, 'PRODUCT_NOT_FOUND');
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });

    if (req.user) {
      await AuditLog.create({
        user: req.user.id,
        userEmail: req.user.email,
        userRole: req.user.role,
        action: 'UPDATE_PRODUCT',
        entity: 'Product',
        entityId: id,
        previousValue: oldProduct,
        newValue: req.body,
        ipAddress: req.ip
      });
    }

    await deleteCachePattern('product:*');
    await deleteCachePattern('products:*');

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminOrders = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { status } = req.query;
    const query: any = {};
    if (status) query.orderStatus = String(status);

    const orders = await Order.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    const order = await Order.findById(id);
    if (!order) throw new AppError('Order not found', 404, 'ORDER_NOT_FOUND');

    const prevStatus = order.orderStatus;
    order.orderStatus = status;
    order.trackingHistory.push({
      status,
      timestamp: new Date(),
      note: note || `Order status updated to ${status}`
    });

    await order.save();

    if (req.user) {
      await AuditLog.create({
        user: req.user.id,
        userEmail: req.user.email,
        userRole: req.user.role,
        action: 'UPDATE_ORDER_STATUS',
        entity: 'Order',
        entityId: id,
        previousValue: { orderStatus: prevStatus },
        newValue: { orderStatus: status },
        ipAddress: req.ip
      });
    }

    res.status(200).json({
      success: true,
      message: `Order status updated to ${status}`,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminBatches = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const batches = await Batch.find().populate('product', 'name slug').sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: batches
    });
  } catch (error) {
    next(error);
  }
};

export const createBatch = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const batch = await Batch.create(req.body);

    if (req.user) {
      await AuditLog.create({
        user: req.user.id,
        userEmail: req.user.email,
        userRole: req.user.role,
        action: 'CREATE_BATCH',
        entity: 'Batch',
        entityId: String(batch._id),
        newValue: req.body,
        ipAddress: req.ip
      });
    }

    res.status(201).json({
      success: true,
      message: 'Batch quality certificate issued successfully',
      data: batch
    });
  } catch (error) {
    next(error);
  }
};

export const getAuditLogs = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const logs = await AuditLog.find().sort({ timestamp: -1 }).limit(50);

    res.status(200).json({
      success: true,
      data: logs
    });
  } catch (error) {
    next(error);
  }
};
