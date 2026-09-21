import app from './app.js';
import { connectDB } from './config/db.js';
import { autoSeedIfEmpty } from './seed/autoSeed.js';
const PORT = process.env.PORT || 5000;
const startServer = async () => {
    try {
        await connectDB();
        await autoSeedIfEmpty();
        app.listen(PORT, () => {
            console.log(`🚀 Subhadarshini API Server running on port ${PORT} [${process.env.NODE_ENV || 'production'}]`);
        });
    }
    catch (error) {
        console.error(`❌ Failed to start server:`, error.message);
    }
};
startServer();
export default app;
