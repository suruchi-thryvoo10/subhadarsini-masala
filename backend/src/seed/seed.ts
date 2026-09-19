import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { connectDB } from '../config/db.js';
import { User } from '../models/User.js';
import { Category } from '../models/Category.js';
import { Product } from '../models/Product.js';
import { Batch } from '../models/Batch.js';
import { Recipe } from '../models/Recipe.js';
import { Dealer } from '../models/Dealer.js';
import { Career } from '../models/Career.js';
import { Review } from '../models/Review.js';

dotenv.config();

const seedData = async () => {
  try {
    console.log('🌱 Starting Subhadarshini Database Seeding...');
    await connectDB();

    // Clear existing collections
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Batch.deleteMany({});
    await Recipe.deleteMany({});
    await Dealer.deleteMany({});
    await Career.deleteMany({});
    await Review.deleteMany({});

    console.log('🧹 Existing data cleared.');

    // 1. Seed Users
    const adminPassword = await bcrypt.hash('admin123', 10);
    const userPassword = await bcrypt.hash('User@123456', 10);

    const adminUser = await User.create({
      name: 'Subhadarshini Admin',
      email: 'admin@subhadarshini.com',
      passwordHash: adminPassword,
      phone: '+91 9876543210',
      role: 'ADMIN',
      isVerified: true
    });

    const demoUser = await User.create({
      name: 'Priyanka Das',
      email: 'priyanka@example.com',
      passwordHash: userPassword,
      phone: '+91 9123456789',
      role: 'CUSTOMER',
      isVerified: true,
      addresses: [
        {
          name: 'Priyanka Das',
          street: 'Plot 402, Saheed Nagar',
          city: 'Bhubaneswar',
          state: 'Odisha',
          pincode: '751007',
          phone: '+91 9123456789',
          isDefault: true
        }
      ]
    });

    console.log('👤 Users seeded (Admin: admin@subhadarshini.com / Admin@123456)');

    // 2. Seed Categories
    const categories = await Category.create([
      {
        name: 'Ground Spices',
        slug: 'ground-spices',
        description: '100% Pure, cold-milled single-origin Indian spices with natural essential oils preserved.',
        image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=800',
        sortOrder: 1
      },
      {
        name: 'Blended Spices',
        slug: 'blended-spices',
        description: 'Authentic royal recipes ground to perfection for curries, gravies, and biryanis.',
        image: 'https://images.unsplash.com/photo-1532336414038-cf19250c5757?auto=format&fit=crop&q=80&w=800',
        sortOrder: 2
      },
      {
        name: 'Whole Spices',
        slug: 'whole-spices',
        description: 'Handpicked premium whole spice seeds, pods, and barks from Kerala and Western Ghats.',
        image: 'https://images.unsplash.com/photo-1509358211425-24d4554b4168?auto=format&fit=crop&q=80&w=800',
        sortOrder: 3
      },
      {
        name: 'Gourmet Seasonings',
        slug: 'gourmet-seasonings',
        description: 'Handcrafted artisan spice rubs, roasted powders, and traditional Odia spice blends.',
        image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=800',
        sortOrder: 4
      }
    ]);

    const groundCat = categories.find(c => c.slug === 'ground-spices')!._id;
    const blendedCat = categories.find(c => c.slug === 'blended-spices')!._id;
    const wholeCat = categories.find(c => c.slug === 'whole-spices')!._id;

    console.log('🏷️ Categories seeded');

    // 3. Seed Products
    const products = await Product.create([
      {
        name: 'Subhadarshini Pure Turmeric Powder (Haldi)',
        slug: 'subhadarshini-pure-turmeric-powder',
        category: groundCat,
        shortDescription: 'High-curcumin (5.2%) golden turmeric ground at low temperatures for rich aroma and color.',
        fullDescription: 'Subhadarshini Pure Turmeric Powder is sourced directly from selected high-grade turmeric roots of Odisha. Processed using ultra-cool cryogenic milling technology to preserve volatile aromatic oils, natural color, and therapeutic 5.2% active Curcumin content. Free from artificial colors, lead, and fillers.',
        ingredients: ['100% Pure Select Turmeric Roots'],
        nutritionalInfo: { energy: '354 kcal', protein: '7.8g', carbs: '65g', fat: '9.9g', sodium: '38mg' },
        variants: [
          { size: '100g', unit: 'g', price: 65, discountPrice: 55, sku: 'SD-TURM-100', stock: 250 },
          { size: '250g', unit: 'g', price: 150, discountPrice: 130, sku: 'SD-TURM-250', stock: 180 },
          { size: '500g', unit: 'g', price: 280, discountPrice: 245, sku: 'SD-TURM-500', stock: 120 }
        ],
        images: [
          'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=1000',
          'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=1000'
        ],
        isFeatured: true,
        ratingAvg: 4.9,
        ratingCount: 142
      },
      {
        name: 'Subhadarshini Royal Garam Masala',
        slug: 'subhadarshini-royal-garam-masala',
        category: blendedCat,
        shortDescription: 'Master blend of 14 roasted aromatic whole spices including Malabar Cardamom and Ceylon Cinnamon.',
        fullDescription: 'Crafted according to traditional heritage recipes, Subhadarshini Royal Garam Masala is a signature blend of slow-roasted whole cardamoms, cloves, black pepper, mace, nutmeg, and bay leaves. It infuses rich warmth and complex aroma into curries, biryanis, and gravies.',
        ingredients: ['Coriander', 'Cumin', 'Black Pepper', 'Green Cardamom', 'Black Cardamom', 'Cinnamon', 'Cloves', 'Nutmeg', 'Mace', 'Star Anise', 'Bay Leaves'],
        nutritionalInfo: { energy: '380 kcal', protein: '11.5g', carbs: '52g', fat: '14.2g', sodium: '45mg' },
        variants: [
          { size: '100g', unit: 'g', price: 110, discountPrice: 95, sku: 'SD-GARAM-100', stock: 160 },
          { size: '250g', unit: 'g', price: 260, discountPrice: 225, sku: 'SD-GARAM-250', stock: 95 }
        ],
        images: [
          'https://images.unsplash.com/photo-1532336414038-cf19250c5757?auto=format&fit=crop&q=80&w=1000'
        ],
        isFeatured: true,
        ratingAvg: 4.95,
        ratingCount: 188
      },
      {
        name: 'Subhadarshini Red Chilli Powder (Lal Mirch)',
        slug: 'subhadarshini-red-chilli-powder',
        category: groundCat,
        shortDescription: 'Vibrant red color with balanced fiery heat from sun-dried ripe chillies.',
        fullDescription: 'Picked at peak ripeness and sun-dried naturally, our Red Chilli Powder brings an appetizing deep crimson hue and fiery flavor profile to your culinary creations.',
        ingredients: ['100% Pure Sun-Dried Red Chillies'],
        nutritionalInfo: { energy: '320 kcal', protein: '12g', carbs: '56g', fat: '8g', sodium: '30mg' },
        variants: [
          { size: '100g', unit: 'g', price: 75, discountPrice: 65, sku: 'SD-CHILLI-100', stock: 200 },
          { size: '250g', unit: 'g', price: 170, discountPrice: 150, sku: 'SD-CHILLI-250', stock: 140 }
        ],
        images: [
          'https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?auto=format&fit=crop&q=80&w=1000'
        ],
        isFeatured: true,
        ratingAvg: 4.8,
        ratingCount: 96
      },
      {
        name: 'Subhadarshini Special Chicken Curry Masala',
        slug: 'subhadarshini-special-chicken-curry-masala',
        category: blendedCat,
        shortDescription: 'Authentic spice blend engineered for deep, flavorful meat & chicken curries.',
        fullDescription: 'Formulated with roasted cumin, coriander, star anise, fennel, and Kashmiri chillies, Subhadarshini Special Chicken Masala yields rich, thick gravy with irresistible tavern-style flavor.',
        ingredients: ['Coriander', 'Cumin', 'Red Chilli', 'Turmeric', 'Garlic Powder', 'Onion Powder', 'Black Pepper', 'Fenugreek', 'Ginger Powder'],
        nutritionalInfo: { energy: '365 kcal', protein: '10.2g', carbs: '58g', fat: '10.5g', sodium: '50mg' },
        variants: [
          { size: '100g', unit: 'g', price: 90, discountPrice: 79, sku: 'SD-CHK-100', stock: 175 },
          { size: '250g', unit: 'g', price: 210, discountPrice: 185, sku: 'SD-CHK-250', stock: 110 }
        ],
        images: [
          'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&q=80&w=1000'
        ],
        isFeatured: true,
        ratingAvg: 4.9,
        ratingCount: 215
      },
      {
        name: 'Subhadarshini Premium Cumin Seeds (Jeera)',
        slug: 'subhadarshini-premium-cumin-seeds',
        category: wholeCat,
        shortDescription: 'Bold, bold-grained Gujarat cumin seeds with intense nutty aroma.',
        fullDescription: 'Hand-picked bold Jeera seeds known for high essential oil concentration. Perfect for tadka (tempering), roasting, and rice preparation.',
        ingredients: ['100% Whole Cumin Seeds'],
        nutritionalInfo: { energy: '375 kcal', protein: '18g', carbs: '44g', fat: '22g', sodium: '168mg' },
        variants: [
          { size: '100g', unit: 'g', price: 85, discountPrice: 75, sku: 'SD-JEERA-100', stock: 190 },
          { size: '250g', unit: 'g', price: 195, discountPrice: 175, sku: 'SD-JEERA-250', stock: 130 }
        ],
        images: [
          'https://images.unsplash.com/photo-1509358211425-24d4554b4168?auto=format&fit=crop&q=80&w=1000'
        ],
        isFeatured: false,
        ratingAvg: 4.85,
        ratingCount: 64
      }
    ]);

    console.log('🌶️ Products seeded');

    // 4. Seed Batches (Quality Traceability System)
    await Batch.create([
      {
        batchNumber: 'SD2026-SP01',
        product: products[0]._id,
        productName: products[0].name,
        mfgDate: new Date('2026-08-15'),
        expiryDate: new Date('2027-08-14'),
        qualityReport: {
          purityScore: '99.8% Certified Pure',
          moistureLevel: '5.2%',
          microbialCheck: 'PASS - Zero E. Coli & Salmonella Detected',
          labCertifiedBy: 'Dr. S. K. Mahapatra (Chief Quality Auditor)',
          testedAt: new Date('2026-08-16'),
          certificateNumber: 'NABL-SD-2026-001'
        },
        facilityLocation: 'Subhadarshini Food Processing Plant, Unit 2, Industrial Estate, Cuttack, Odisha',
        isVerified: true
      },
      {
        batchNumber: 'SD2026-GM04',
        product: products[1]._id,
        productName: products[1].name,
        mfgDate: new Date('2026-09-01'),
        expiryDate: new Date('2027-08-31'),
        qualityReport: {
          purityScore: '99.9% Certified Pure',
          moistureLevel: '4.8%',
          microbialCheck: 'PASS - Certified Food Grade Quality',
          labCertifiedBy: 'Dr. Ananya Roy (Lead Food Scientist)',
          testedAt: new Date('2026-09-02'),
          certificateNumber: 'NABL-SD-2026-004'
        },
        facilityLocation: 'Subhadarshini Spice Works, Zone B, Khordha Agro Tech Park, Odisha',
        isVerified: true
      }
    ]);

    console.log('🔬 Quality Traceability Batches seeded');

    // 5. Seed Recipes
    await Recipe.create([
      {
        title: 'Traditional Odia Mamsa Kasa (Spiced Mutton Curry)',
        slug: 'traditional-odia-mamsa-kasa',
        category: 'Non-Vegetarian',
        prepTimeMinutes: 20,
        cookTimeMinutes: 45,
        difficulty: 'MEDIUM',
        servings: 4,
        image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&q=80&w=1000',
        description: 'Rich, slow-cooked mutton curry in caramelised onion and stone-ground spices.',
        ingredients: [
          { name: 'Tender Mutton', quantity: '500g' },
          { name: 'Subhadarshini Pure Mustard Oil', quantity: '3 tbsp', isSubhadarshiniProduct: true },
          { name: 'Subhadarshini Royal Garam Masala', quantity: '2 tbsp', isSubhadarshiniProduct: true },
          { name: 'Subhadarshini Pure Turmeric Powder', quantity: '1 tbsp', isSubhadarshiniProduct: true },
          { name: 'Subhadarshini Red Chilli Powder', quantity: '1.5 tbsp', isSubhadarshiniProduct: true },
          { name: 'Sliced Onions', quantity: '3 large' },
          { name: 'Ginger-Garlic Paste', quantity: '2 tbsp' }
        ],
        instructions: [
          'Marinate mutton with Subhadarshini Turmeric Powder, red chilli, and curd for 30 minutes.',
          'Heat mustard oil in a heavy handi, saute onions till deep brown.',
          'Add ginger-garlic paste and cook till raw aroma vanishes.',
          'Stir in Subhadarshini Royal Garam Masala, add marinated mutton and slow cook on medium heat for 40 mins.',
          'Garnish with fresh cilantro and serve with hot boiled rice or paratha.'
        ],
        requiredProducts: [products[0]._id, products[1]._id, products[2]._id],
        isFeatured: true
      }
    ]);

    console.log('🍲 Recipes seeded');

    // 6. Seed Dealers
    await Dealer.create([
      {
        name: 'Jagannath Spice Mart',
        state: 'Odisha',
        city: 'Bhubaneswar',
        pincode: '751007',
        address: 'Shop 14, Saheed Nagar Main Market, Bhubaneswar',
        phone: '+91 9437012345',
        email: 'jagannath.spices@gmail.com',
        coordinates: { lat: 20.2961, lng: 85.8245 },
        openingHours: '09:00 AM - 09:30 PM',
        isActive: true
      },
      {
        name: 'Cuttack Grand Supermarket',
        state: 'Odisha',
        city: 'Cuttack',
        pincode: '753001',
        address: 'Choudhury Bazar, Opp. City Hospital, Cuttack',
        phone: '+91 9861054321',
        email: 'cuttacksuper@gmail.com',
        coordinates: { lat: 20.4625, lng: 85.8828 },
        openingHours: '08:30 AM - 10:00 PM',
        isActive: true
      },
      {
        name: 'Puri Grand Road Traders',
        state: 'Odisha',
        city: 'Puri',
        pincode: '752001',
        address: 'Grand Road, Near Simhadwar, Puri',
        phone: '+91 9124098765',
        email: 'puritrader@gmail.com',
        coordinates: { lat: 19.8135, lng: 85.8312 },
        openingHours: '08:00 AM - 09:00 PM',
        isActive: true
      }
    ]);

    console.log('🏪 Dealers seeded');

    // 7. Seed Careers
    await Career.create([
      {
        title: 'Senior Quality Assurance Specialist',
        department: 'Quality Control',
        location: 'Cuttack Plant, Odisha',
        type: 'Full-time',
        experience: '5+ Years',
        description: 'Lead raw spice quality auditing, HPLC lab testing, and batch certification processes.',
        requirements: ['M.Sc in Food Technology / Chemistry', '5+ years FMCG lab experience', 'Knowledge of FSSAI & ISO 22000'],
        isActive: true
      },
      {
        title: 'Territory Sales Manager - FMCG',
        department: 'Sales & Distribution',
        location: 'Bhubaneswar, Odisha',
        type: 'Full-time',
        experience: '3+ Years',
        description: 'Expand GT/MT retail footprint across coastal Odisha districts.',
        requirements: ['3+ years FMCG spice/food sales experience', 'Strong retail network', 'Fluent in Odia and Hindi'],
        isActive: true
      }
    ]);

    console.log('💼 Careers seeded');

    // 8. Seed Sample Review
    await Review.create({
      product: products[0]._id,
      user: demoUser._id,
      userName: 'Priyanka Das',
      userEmail: 'priyanka@example.com',
      rating: 5,
      title: 'Best Turmeric in Odisha!',
      comment: 'The aroma and golden color are so rich. You can tell it is 100% pure without adulteration. Highly recommended!',
      isVerifiedPurchase: true,
      status: 'APPROVED'
    });

    console.log('⭐ Reviews seeded');
    console.log('🎉 Subhadarshini Database Seeding Completed Successfully!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  }
};

seedData();
