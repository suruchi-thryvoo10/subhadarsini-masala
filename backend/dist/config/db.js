import mongoose from 'mongoose';
const globalWithMongoose = globalThis;
const cache = globalWithMongoose.__subhadarshiniMongoose ||
    (globalWithMongoose.__subhadarshiniMongoose = { promise: null, conn: null });
const isServerless = Boolean(process.env.VERCEL) || process.env.NODE_ENV === 'production';
export class DatabaseConfigError extends Error {
    code = 'MONGODB_URI_MISSING';
}
export const getMongoUri = () => {
    const uri = (process.env.MONGODB_URI || '').trim();
    if (uri)
        return uri;
    if (isServerless) {
        // Never silently fall back to localhost in a serverless/production runtime:
        // it produces opaque "buffering timed out" errors instead of a real diagnosis.
        throw new DatabaseConfigError('MONGODB_URI is not set on this deployment. Add it in the Vercel project settings (Settings → Environment Variables) and redeploy.');
    }
    return 'mongodb://127.0.0.1:27017/subhadarshini_db';
};
/** Masked host for diagnostics — never exposes credentials. */
export const describeMongoTarget = () => {
    const uri = (process.env.MONGODB_URI || '').trim();
    if (!uri)
        return 'unset';
    return uri.replace(/\/\/[^@]*@/, '//***:***@').replace(/\?.*$/, '');
};
const connectInMemoryFallback = async () => {
    try {
        // Optional dev dependency — resolved lazily so production installs don't need it.
        const { MongoMemoryServer } = await import('mongodb-memory-server');
        const server = await MongoMemoryServer.create();
        const conn = await mongoose.connect(server.getUri(), { bufferCommands: false });
        console.log('[Database] Using in-memory MongoDB (development fallback).');
        return conn;
    }
    catch (fallbackError) {
        console.error(`[Database] In-memory fallback unavailable: ${fallbackError.message}`);
        return null;
    }
};
export const connectDB = async () => {
    if (cache.conn && mongoose.connection.readyState === 1) {
        return cache.conn;
    }
    if (!cache.promise) {
        const uri = getMongoUri();
        cache.promise = mongoose
            .connect(uri, {
            // Surface connection failures immediately instead of queueing operations
            // for 10s and failing with an unrelated "buffering timed out" error.
            bufferCommands: false,
            // Kept comfortably under Vercel's function timeout so a failure returns a
            // real error response instead of the function being killed mid-request.
            serverSelectionTimeoutMS: 5000,
            connectTimeoutMS: 7000,
            socketTimeoutMS: 20000,
            maxPoolSize: 5,
            minPoolSize: 0
        })
            .then((m) => {
            cache.conn = m;
            console.log(`[Database] MongoDB connected: ${m.connection.host}/${m.connection.name}`);
            return m;
        })
            .catch(async (error) => {
            cache.promise = null;
            cache.conn = null;
            console.error(`[Database] MongoDB connection failed: ${error.message}`);
            // Local development convenience only: spin up an in-memory MongoDB when no
            // real server is reachable. Never attempted on Vercel/production.
            if (!isServerless) {
                const memoryConn = await connectInMemoryFallback();
                if (memoryConn) {
                    cache.conn = memoryConn;
                    return memoryConn;
                }
            }
            throw error;
        });
    }
    try {
        return await cache.promise;
    }
    catch (error) {
        cache.promise = null;
        cache.conn = null;
        throw error;
    }
};
export const getDbStatus = () => {
    const states = {
        0: 'disconnected',
        1: 'connected',
        2: 'connecting',
        3: 'disconnecting',
        99: 'uninitialized'
    };
    return {
        readyState: mongoose.connection.readyState,
        state: states[mongoose.connection.readyState] ?? 'unknown',
        hasMongoUri: Boolean((process.env.MONGODB_URI || '').trim()),
        target: describeMongoTarget(),
        dbName: mongoose.connection.name || null
    };
};
