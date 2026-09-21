import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
let cachedPromise = null;
let mongoMemoryServer = null;
export const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) {
        return mongoose;
    }
    if (mongoose.connection.readyState === 0) {
        cachedPromise = null;
    }
    if (cachedPromise) {
        return cachedPromise;
    }
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/subhadarshini_db';
    cachedPromise = mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 10000
    }).then((m) => {
        console.log(`[Database] MongoDB Connected: ${m.connection.host}/${m.connection.name}`);
        return m;
    }).catch(async (error) => {
        cachedPromise = null;
        console.warn(`[Database] Direct MongoDB connection failed: ${error.message}`);
        // Only attempt MongoMemoryServer in local dev environment, not in serverless/production
        if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
            try {
                mongoMemoryServer = await MongoMemoryServer.create();
                const memoryUri = mongoMemoryServer.getUri();
                const fallbackConn = await mongoose.connect(memoryUri);
                console.log(`[Database] MongoMemoryServer connected at ${memoryUri}`);
                return fallbackConn;
            }
            catch (fallbackError) {
                console.error(`[Database] In-memory database fallback error:`, fallbackError);
            }
        }
        throw error;
    });
    return cachedPromise;
};
