import dotenv from 'dotenv';
import { connectDB } from '../config/db.js';
import { User } from '../models/User.js';
import { Category } from '../models/Category.js';
import { Product } from '../models/Product.js';
import { Batch } from '../models/Batch.js';
import { Recipe } from '../models/Recipe.js';
import { Dealer } from '../models/Dealer.js';
import { Career } from '../models/Career.js';
import { Review } from '../models/Review.js';
import { autoSeedIfEmpty } from './autoSeed.js';
dotenv.config();
const seedData = async () => {
    try {
        console.log('🌱 Starting Full Subhadarshini Database Seeding...');
        await connectDB();
        // Clear existing collections to force full fresh seed
        await User.deleteMany({});
        await Category.deleteMany({});
        await Product.deleteMany({});
        await Batch.deleteMany({});
        await Recipe.deleteMany({});
        await Dealer.deleteMany({});
        await Career.deleteMany({});
        await Review.deleteMany({});
        console.log('🧹 Existing data cleared from Atlas DB.');
        await autoSeedIfEmpty();
        console.log('🎉 Full Subhadarshini Catalog & Collections Seeding Completed Successfully!');
        process.exit(0);
    }
    catch (error) {
        console.error('❌ Error during seeding:', error);
        process.exit(1);
    }
};
seedData();
