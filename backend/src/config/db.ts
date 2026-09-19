import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoMemoryServer: MongoMemoryServer | null = null;

export const connectDB = async (): Promise<void> => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/subhadarshini_db';

  try {
    // Attempt connecting to configured MongoDB Atlas / local MongoDB with a 3s timeout
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000
    });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error: any) {
    console.warn(`[Database] Direct MongoDB connection (${uri}) failed or timed out. Initializing In-Memory Database Fallback...`);
    
    try {
      mongoMemoryServer = await MongoMemoryServer.create();
      const memoryUri = mongoMemoryServer.getUri();
      await mongoose.connect(memoryUri);
      console.log(`[Database] MongoMemoryServer instance connected successfully at ${memoryUri}`);
    } catch (fallbackError) {
      console.error(`[Database] In-memory database fallback error:`, fallbackError);
    }
  }
};
