import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

import { connectDB } from './config/db.js';
import { redis } from './config/redis.js';
import { globalErrorHandler } from './middlewares/errorHandler.js';
import { apiRateLimiter } from './middlewares/rateLimiter.js';
import { autoSeedIfEmpty } from './seed/autoSeed.js';

import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import batchRoutes from './routes/batchRoutes.js';
import recipeRoutes from './routes/recipeRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import dealerRoutes from './routes/dealerRoutes.js';
import enquiryRoutes from './routes/enquiryRoutes.js';
import careerRoutes from './routes/careerRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Utility Middlewares
app.use((helmet as any)({
  contentSecurityPolicy: false // Disabled for dev flexibility
}));

app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Global Rate Limiter
app.use('/api', apiRateLimiter);

// Health Check
app.get(['/health', '/api/v1/health'], (req, res) => {
  res.status(200).json({
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    service: 'Subhadarshini Backend API Node Instance',
    version: '1.0.0',
    redisConnected: redis.status === 'ready'
  });
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/quality', batchRoutes);
app.use('/api/v1/recipes', recipeRoutes);
app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1/dealers', dealerRoutes);
app.use('/api/v1/enquiries', enquiryRoutes);
app.use('/api/v1/careers', careerRoutes);
app.use('/api/v1/admin', adminRoutes);

// Global Error Handler
app.use(globalErrorHandler);

// Start Server & DB Connections
const startServer = async () => {
  await connectDB();
  await autoSeedIfEmpty();
  app.listen(PORT, () => {
    console.log(`🚀 Subhadarshini API Server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
  });
};

startServer();

export default app;
