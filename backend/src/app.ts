import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { globalErrorHandler } from './middlewares/errorHandler.js';
import { apiRateLimiter } from './middlewares/rateLimiter.js';

import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import batchRoutes from './routes/batchRoutes.js';
import recipeRoutes from './routes/recipeRoutes.js';
import dealerRoutes from './routes/dealerRoutes.js';
import enquiryRoutes from './routes/enquiryRoutes.js';
import careerRoutes from './routes/careerRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();

const app = express();

app.use((helmet as any)());
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply rate limiter to /api
app.use('/api', apiRateLimiter);

// Root & Healthcheck endpoints
app.get(['/', '/health', '/api/v1/health'], (req, res) => {
  res.status(200).json({
    status: 'UP',
    brand: 'Subhadarshini Spices & Foods Pvt. Ltd.',
    service: 'Subhadarshini API Node Instance',
    environment: process.env.NODE_ENV || 'production',
    endpoints: {
      health: '/health',
      auth: '/api/v1/auth',
      products: '/api/v1/products',
      categories: '/api/v1/categories',
      orders: '/api/v1/orders',
      quality: '/api/v1/quality',
      recipes: '/api/v1/recipes',
      enquiries: '/api/v1/enquiries',
      dealers: '/api/v1/dealers',
      careers: '/api/v1/careers',
      reviews: '/api/v1/reviews'
    },
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/quality', batchRoutes);
app.use('/api/v1/recipes', recipeRoutes);
app.use('/api/v1/dealers', dealerRoutes);
app.use('/api/v1/enquiries', enquiryRoutes);
app.use('/api/v1/careers', careerRoutes);
app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1/admin', adminRoutes);

// Global Error Handler
app.use(globalErrorHandler);

export default app;
