import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { globalErrorHandler } from './middlewares/errorHandler.js';
import { apiRateLimiter } from './middlewares/rateLimiter.js';
import { isRedisReady, isRedisConfigured } from './config/redis.js';
import { connectDB, getDbStatus } from './config/db.js';
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
import statsRoutes from './routes/statsRoutes.js';
const app = express();
// Trust reverse proxy (Nginx / Vercel / Cloudflare / AWS Load Balancers)
app.set('trust proxy', 1);
// Security Headers
app.use(helmet({
    contentSecurityPolicy: false
}));
// Dynamic CORS Configuration
const allowedOrigins = [
    process.env.FRONTEND_URL,
    process.env.CORS_ORIGIN,
    'http://localhost:3000',
    'http://localhost:5173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173'
].filter(Boolean);
app.use(cors({
    origin: (origin, callback) => {
        // Allow non-browser requests (e.g. curl, postman, server-to-server)
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
            return callback(null, true);
        }
        // In production or fallback, reflect the request origin to safely support credentials
        return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    optionsSuccessStatus: 200
}));
if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('dev'));
}
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
// Apply rate limiter to /api
app.use('/api', apiRateLimiter);
// Root & Healthcheck endpoints
app.get(['/', '/health', '/api/v1/health'], (req, res) => {
    res.status(200).json({
        status: 'OK',
        brand: 'Subhadarshini Spices & Foods Pvt. Ltd.',
        service: 'Subhadarshini Backend API Node Instance',
        environment: process.env.NODE_ENV || 'production',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        redis: { configured: isRedisConfigured, connected: isRedisReady() },
        database: getDbStatus()
    });
});
// Database diagnostics — reports configuration state without exposing credentials.
app.get('/api/v1/health/db', async (req, res) => {
    // Wait for the attempt to settle so a cold instance reports the real outcome
    // rather than a transient "connecting".
    let connectError = null;
    try {
        await connectDB();
    }
    catch (err) {
        connectError = err.message;
    }
    const db = getDbStatus();
    res.status(db.readyState === 1 ? 200 : 503).json({
        success: db.readyState === 1,
        database: db,
        ...(connectError && { error: connectError }),
        hint: db.hasMongoUri
            ? 'MONGODB_URI is configured. If the state is not "connected", check the MongoDB Atlas Network Access IP allowlist (0.0.0.0/0 is required for Vercel) and the database user credentials.'
            : 'MONGODB_URI is missing on this deployment. Add it under Vercel → Project Settings → Environment Variables, then redeploy.'
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
app.use('/api/v1/stats', statsRoutes);
// Global Error Handler
app.use(globalErrorHandler);
export default app;
