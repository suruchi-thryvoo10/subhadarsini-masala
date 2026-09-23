import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { Category } from '../models/Category.js';
import { Product } from '../models/Product.js';
import { Batch } from '../models/Batch.js';
import { Recipe } from '../models/Recipe.js';
import { Dealer } from '../models/Dealer.js';
import { Career } from '../models/Career.js';
import { CATEGORY_IMAGES, RECIPE_IMAGES, FALLBACK_IMAGES, resolveProductImages } from '../data/productImages.js';
export const autoSeedIfEmpty = async () => {
    try {
        const adminPassword = await bcrypt.hash('admin123', 10);
        // Always ensure admin@subhadarshini.com exists
        const existingAdmin = await User.findOne({ email: 'admin@subhadarshini.com' });
        if (!existingAdmin) {
            await User.create({
                name: 'Subhadarshini Admin',
                email: 'admin@subhadarshini.com',
                passwordHash: adminPassword,
                role: 'ADMIN'
            });
            console.log('🔐 [AutoSeed] Created demo Admin user (admin@subhadarshini.com)');
        }
        else {
            const isMatch = await bcrypt.compare('admin123', existingAdmin.passwordHash);
            if (!isMatch) {
                existingAdmin.passwordHash = adminPassword;
                await existingAdmin.save();
            }
        }
        // 2. Ensure Categories exist
        const categoryDefs = [
            {
                name: 'Ground Spices',
                slug: 'ground-spices',
                tagline: "Single-origin roots and pods, cold-milled so the aroma survives the grinding.",
                highlights: ["Cryogenic low-heat milling", "Natural colour, zero added dyes", "Curcumin & capsaicin assayed per batch"],
                description: '100% Pure, cold-milled single-origin Indian spices with natural essential oils preserved.',
                image: CATEGORY_IMAGES['ground-spices'],
                sortOrder: 1
            },
            {
                name: 'Blended Spices',
                slug: 'blended-spices',
                tagline: "Recipes weighed to the gram, ground fresh, and balanced for one dish at a time.",
                highlights: ["Dish-specific formulations", "Whole spices roasted before blending", "No starch or salt fillers"],
                description: 'Authentic royal recipes ground to perfection for curries, gravies, and biryanis.',
                image: CATEGORY_IMAGES['blended-spices'],
                sortOrder: 2
            },
            {
                name: 'Whole Spices',
                slug: 'whole-spices',
                tagline: "Hand-sorted seeds, pods and leaves, cleaned and graded before they reach the pack.",
                highlights: ["Size-graded for even roasting", "De-stoned and sieved twice", "Moisture held under 8%"],
                description: 'Handpicked premium whole spice seeds, pods, and barks from Kerala and Western Ghats.',
                image: CATEGORY_IMAGES['whole-spices'],
                sortOrder: 3
            },
            {
                name: 'Gourmet Seasonings',
                slug: 'gourmet-seasonings',
                tagline: "Odia kitchen classics and roasted blends you would otherwise grind at home.",
                highlights: ["Traditional regional recipes", "Small-batch roasted", "Made for finishing, not just cooking"],
                description: 'Handcrafted artisan spice rubs, roasted powders, and traditional Odia spice blends.',
                image: CATEGORY_IMAGES['gourmet-seasonings'],
                sortOrder: 4
            },
            {
                name: 'Premium Food Items',
                slug: 'premium-food-items',
                tagline: "The everyday staples a working kitchen runs out of first.",
                highlights: ["Food-grade certified", "Sieved for lump-free use", "Family packs and refills"],
                description: 'Everyday kitchen staples — soya chunks, daliya, corn flour, black salt and more.',
                image: CATEGORY_IMAGES['premium-food-items'],
                sortOrder: 5
            },
            {
                name: 'Upcoming Products',
                slug: 'upcoming-products',
                tagline: "Launching soon — in final packaging and quality trials right now.",
                highlights: ["In pilot production", "Lab trials under way", "Dealer pre-orders opening shortly"],
                description: 'New Subhadarshini products launching soon.',
                image: CATEGORY_IMAGES['upcoming-products'],
                sortOrder: 6
            }
        ];
        const categoryMap = {};
        for (const catDef of categoryDefs) {
            let cat = await Category.findOne({ slug: catDef.slug });
            if (!cat) {
                cat = await Category.create(catDef);
            }
            else {
                // Keep the landing-page copy and artwork in sync with this file.
                cat.image = catDef.image;
                cat.description = catDef.description;
                cat.tagline = catDef.tagline;
                cat.highlights = catDef.highlights;
                cat.sortOrder = catDef.sortOrder;
                if (cat.isModified())
                    await cat.save();
            }
            categoryMap[catDef.slug] = cat._id;
        }
        const groundCat = categoryMap['ground-spices'];
        const blendedCat = categoryMap['blended-spices'];
        const wholeCat = categoryMap['whole-spices'];
        const gourmetCat = categoryMap['gourmet-seasonings'];
        const premiumCat = categoryMap['premium-food-items'];
        const upcomingCat = categoryMap['upcoming-products'];
        // 3. Define Full Subhadarshini Spice & Masala Catalog
        const productCatalog = [
            // Ground Spices
            {
                name: 'Subhadarshini Pure Turmeric Powder (Haldi)',
                slug: 'subhadarshini-pure-turmeric-powder',
                category: groundCat,
                shortDescription: 'High-curcumin (5.2%) golden turmeric ground at low temperatures for rich aroma and colour.',
                fullDescription: 'Subhadarshini Pure Turmeric Powder is sourced directly from selected high-grade turmeric roots of Odisha. Processed using ultra-cool cryogenic milling technology to preserve volatile aromatic oils, natural colour, and therapeutic 5.2% active Curcumin content.',
                ingredients: ['100% Pure Select Turmeric Roots'],
                nutritionalInfo: { energy: '354 kcal', protein: '7.8g', carbs: '65g', fat: '9.9g', sodium: '38mg' },
                variants: [
                    { size: '100g', unit: 'g', price: 65, discountPrice: 55, sku: 'SD-TURM-100', stock: 250 },
                    { size: '250g', unit: 'g', price: 150, discountPrice: 130, sku: 'SD-TURM-250', stock: 180 },
                    { size: '500g', unit: 'g', price: 280, discountPrice: 245, sku: 'SD-TURM-500', stock: 120 }
                ],
                images: [],
                isFeatured: true,
                ratingAvg: 4.9,
                ratingCount: 142
            },
            {
                name: 'Subhadarshini Red Chilli Powder (Lal Mirch)',
                slug: 'subhadarshini-red-chilli-powder',
                category: groundCat,
                shortDescription: 'Vibrant red colour with balanced fiery heat from sun-dried ripe chillies.',
                fullDescription: 'Picked at peak ripeness and sun-dried naturally, our Red Chilli Powder brings an appetizing deep crimson hue and fiery flavour profile to your culinary creations.',
                ingredients: ['100% Pure Sun-Dried Red Chillies'],
                nutritionalInfo: { energy: '320 kcal', protein: '12g', carbs: '56g', fat: '8g', sodium: '30mg' },
                variants: [
                    { size: '100g', unit: 'g', price: 75, discountPrice: 65, sku: 'SD-CHILLI-100', stock: 200 },
                    { size: '250g', unit: 'g', price: 170, discountPrice: 150, sku: 'SD-CHILLI-250', stock: 140 }
                ],
                images: [],
                isFeatured: true,
                ratingAvg: 4.8,
                ratingCount: 96
            },
            {
                name: 'Subhadarshini Coriander Powder (Dhania Powder)',
                slug: 'subhadarshini-coriander-powder',
                category: groundCat,
                shortDescription: 'Freshly ground aromatic coriander seeds with citrusy, sweet undertones.',
                fullDescription: 'Milled from premium grade green coriander seeds. It acts as a natural thickener while infusing mild citrus aroma and earthy sweetness into Indian gravies.',
                ingredients: ['100% Whole Green Coriander Seeds'],
                nutritionalInfo: { energy: '298 kcal', protein: '12.3g', carbs: '54.9g', fat: '17.8g', sodium: '35mg' },
                variants: [
                    { size: '100g', unit: 'g', price: 55, discountPrice: 48, sku: 'SD-DHAN-100', stock: 220 },
                    { size: '250g', unit: 'g', price: 130, discountPrice: 115, sku: 'SD-DHAN-250', stock: 160 }
                ],
                images: [],
                isFeatured: false,
                ratingAvg: 4.75,
                ratingCount: 82
            },
            {
                name: 'Subhadarshini Cumin Powder (Jeera Powder)',
                slug: 'subhadarshini-cumin-powder',
                category: groundCat,
                shortDescription: 'Slow-roasted Gujarat cumin powder with nutty, warm savory notes.',
                fullDescription: 'Slow-roasted on low flame before fine grinding to unlock maximum volatile oils. Perfect for raita, buttermilk, curries, and roasted snacks.',
                ingredients: ['100% Roasted Gujarat Cumin Seeds'],
                nutritionalInfo: { energy: '375 kcal', protein: '17.8g', carbs: '44.2g', fat: '22.3g', sodium: '168mg' },
                variants: [
                    { size: '100g', unit: 'g', price: 80, discountPrice: 70, sku: 'SD-JEERAP-100', stock: 190 },
                    { size: '250g', unit: 'g', price: 185, discountPrice: 165, sku: 'SD-JEERAP-250', stock: 130 }
                ],
                images: [],
                isFeatured: false,
                ratingAvg: 4.85,
                ratingCount: 74
            },
            {
                name: 'Subhadarshini Kashmiri Red Chilli Powder',
                slug: 'subhadarshini-kashmiri-chilli-powder',
                category: groundCat,
                shortDescription: 'Intense rich red colour with mild gentle heat for vibrant curries and marinades.',
                fullDescription: 'Sourced from select Kashmiri chillies, famous worldwide for imparting rich ruby red colour to dishes without making them uncomfortably spicy.',
                ingredients: ['100% Pure Kashmiri Red Chillies'],
                nutritionalInfo: { energy: '315 kcal', protein: '11.8g', carbs: '55.4g', fat: '7.9g', sodium: '28mg' },
                variants: [
                    { size: '100g', unit: 'g', price: 95, discountPrice: 85, sku: 'SD-KASH-100', stock: 170 },
                    { size: '250g', unit: 'g', price: 220, discountPrice: 195, sku: 'SD-KASH-250', stock: 110 }
                ],
                images: [],
                isFeatured: true,
                ratingAvg: 4.92,
                ratingCount: 118
            },
            {
                name: 'Subhadarshini Black Pepper Powder (Gol Maricha)',
                slug: 'subhadarshini-black-pepper-powder',
                category: groundCat,
                shortDescription: 'Pungent, high-piperine Malabar black pepper powder.',
                fullDescription: 'Freshly ground from whole Malabar black peppercorns. Rich in piperine for immune boosting warmth and sharp pungent flavour.',
                ingredients: ['100% Malabar Black Peppercorns'],
                nutritionalInfo: { energy: '251 kcal', protein: '10.4g', carbs: '64g', fat: '3.3g', sodium: '20mg' },
                variants: [
                    { size: '50g', unit: 'g', price: 65, discountPrice: 58, sku: 'SD-PEP-50', stock: 210 },
                    { size: '100g', unit: 'g', price: 120, discountPrice: 105, sku: 'SD-PEP-100', stock: 150 }
                ],
                images: [],
                isFeatured: false,
                ratingAvg: 4.88,
                ratingCount: 65
            },
            {
                name: 'Subhadarshini Pure Amchur Powder (Dry Mango)',
                slug: 'subhadarshini-pure-amchur-powder',
                category: groundCat,
                shortDescription: '100% natural sun-dried unripe green mango powder for tangy sour flavour.',
                fullDescription: 'Made from raw green mangoes sliced and sun-dried naturally. Adds a fruity tartness to samosa filling, chole, chutneys, and marinades.',
                ingredients: ['100% Pure Raw Green Mango'],
                nutritionalInfo: { energy: '290 kcal', protein: '3.2g', carbs: '68g', fat: '2.1g', sodium: '25mg' },
                variants: [
                    { size: '100g', unit: 'g', price: 75, discountPrice: 65, sku: 'SD-AMCH-100', stock: 180 },
                    { size: '250g', unit: 'g', price: 175, discountPrice: 150, sku: 'SD-AMCH-250', stock: 120 }
                ],
                images: [],
                isFeatured: false,
                ratingAvg: 4.86,
                ratingCount: 88
            },
            // Blended Spices & Special Masalas
            {
                name: 'Subhadarshini Royal Garam Masala',
                slug: 'subhadarshini-royal-garam-masala',
                category: blendedCat,
                shortDescription: 'Master blend of 14 roasted aromatic whole spices including Malabar Cardamom and Ceylon Cinnamon.',
                fullDescription: 'Crafted according to traditional heritage recipes, Subhadarshini Royal Garam Masala is a signature blend of slow-roasted whole cardamoms, cloves, black pepper, mace, nutmeg, and bay leaves.',
                ingredients: ['Coriander', 'Cumin', 'Black Pepper', 'Green Cardamom', 'Black Cardamom', 'Cinnamon', 'Cloves', 'Nutmeg', 'Mace', 'Star Anise', 'Bay Leaves'],
                nutritionalInfo: { energy: '380 kcal', protein: '11.5g', carbs: '52g', fat: '14.2g', sodium: '45mg' },
                variants: [
                    { size: '100g', unit: 'g', price: 110, discountPrice: 95, sku: 'SD-GARAM-100', stock: 160 },
                    { size: '250g', unit: 'g', price: 260, discountPrice: 225, sku: 'SD-GARAM-250', stock: 95 }
                ],
                images: [],
                isFeatured: true,
                ratingAvg: 4.95,
                ratingCount: 188
            },
            {
                name: 'Subhadarshini Special Chicken Curry Masala',
                slug: 'subhadarshini-special-chicken-curry-masala',
                category: blendedCat,
                shortDescription: 'Authentic spice blend engineered for deep, flavorful meat & chicken curries.',
                fullDescription: 'Formulated with roasted cumin, coriander, star anise, fennel, and Kashmiri chillies, Subhadarshini Special Chicken Masala yields rich, thick gravy with irresistible tavern-style flavour.',
                ingredients: ['Coriander', 'Cumin', 'Red Chilli', 'Turmeric', 'Garlic Powder', 'Onion Powder', 'Black Pepper', 'Fenugreek', 'Ginger Powder'],
                nutritionalInfo: { energy: '365 kcal', protein: '10.2g', carbs: '58g', fat: '10.5g', sodium: '50mg' },
                variants: [
                    { size: '100g', unit: 'g', price: 90, discountPrice: 79, sku: 'SD-CHK-100', stock: 175 },
                    { size: '250g', unit: 'g', price: 210, discountPrice: 185, sku: 'SD-CHK-250', stock: 110 }
                ],
                images: [],
                isFeatured: true,
                ratingAvg: 4.9,
                ratingCount: 215
            },
            {
                name: 'Subhadarshini Mutton & Meat Masala',
                slug: 'subhadarshini-mutton-meat-masala',
                category: blendedCat,
                shortDescription: 'Deep, rich aromatic spice blend for slow-cooked tender meat gravy.',
                fullDescription: 'Formulated specifically for mutton kasa, rich rogan josh, and slow-cooked meat stews. Infuses deep colour and bold savory spices.',
                ingredients: ['Coriander', 'Red Chilli', 'Cumin', 'Black Pepper', 'Cinnamon', 'Clove', 'Ginger', 'Garlic', 'Cardamom', 'Nutmeg'],
                nutritionalInfo: { energy: '370 kcal', protein: '11g', carbs: '54g', fat: '12g', sodium: '48mg' },
                variants: [
                    { size: '100g', unit: 'g', price: 105, discountPrice: 92, sku: 'SD-MEAT-100', stock: 150 },
                    { size: '250g', unit: 'g', price: 245, discountPrice: 215, sku: 'SD-MEAT-250', stock: 90 }
                ],
                images: [],
                isFeatured: true,
                ratingAvg: 4.93,
                ratingCount: 164
            },
            {
                name: 'Subhadarshini Royal Dum Biryani Masala',
                slug: 'subhadarshini-royal-dum-biryani-masala',
                category: blendedCat,
                shortDescription: 'Aromatic royal blend of green cardamom, star anise, mace, and nutmeg for rich restaurant-style dum biryanis.',
                fullDescription: 'Subhadarshini Royal Dum Biryani Masala is a regal blend of handpicked whole spices, including green and black cardamom, Ceylon cinnamon, star anise, nutmeg, and mace. Designed to yield authentic Awadhi and Hyderabadi flavour with unmatched aroma.',
                ingredients: ['Green Cardamom', 'Cumin', 'Coriander', 'Black Peppercorn', 'Star Anise', 'Cinnamon', 'Nutmeg', 'Mace', 'Cloves', 'Bay Leaf'],
                nutritionalInfo: { energy: '385 kcal', protein: '11g', carbs: '51g', fat: '14.5g', sodium: '40mg' },
                variants: [
                    { size: '100g', unit: 'g', price: 125, discountPrice: 105, sku: 'SD-BIRY-100', stock: 180 },
                    { size: '250g', unit: 'g', price: 290, discountPrice: 250, sku: 'SD-BIRY-250', stock: 110 }
                ],
                images: [],
                isFeatured: true,
                ratingAvg: 4.96,
                ratingCount: 172
            },
            {
                name: 'Subhadarshini Kitchen King All-in-One Masala',
                slug: 'subhadarshini-kitchen-king-masala',
                category: blendedCat,
                shortDescription: 'The supreme multi-purpose curry spice blend for all vegetable stir-fries, gravies, and dals.',
                fullDescription: 'Subhadarshini Kitchen King Masala is the ultimate all-rounder spice mixture. Perfect for everyday home cooking, enhancing dry sabjis, paneer curries, dal fry, and vegetable gravies with golden colour and savory taste.',
                ingredients: ['Coriander', 'Cumin', 'Turmeric', 'Red Chilli', 'Black Pepper', 'Dry Ginger', 'Cassia', 'Fennel', 'Fenugreek', 'Nutmeg', 'Asafoetida'],
                nutritionalInfo: { energy: '360 kcal', protein: '10.8g', carbs: '56g', fat: '9.5g', sodium: '42mg' },
                variants: [
                    { size: '100g', unit: 'g', price: 85, discountPrice: 75, sku: 'SD-KKING-100', stock: 220 },
                    { size: '250g', unit: 'g', price: 195, discountPrice: 175, sku: 'SD-KKING-250', stock: 150 }
                ],
                images: [],
                isFeatured: true,
                ratingAvg: 4.92,
                ratingCount: 195
            },
            {
                name: 'Subhadarshini Paneer Butter Masala Mix',
                slug: 'subhadarshini-paneer-butter-masala',
                category: blendedCat,
                shortDescription: 'Rich cashew-infused aromatic spice mix for creamy, restaurant-style paneer butter masala.',
                fullDescription: 'Crafted with roasted cashew powder, kasuri methi, cardamom, and Kashmiri chilli. Create silky smooth, restaurant-grade Paneer Butter Masala and Shahi Paneer in under 15 minutes.',
                ingredients: ['Cashew Powder', 'Kashmiri Red Chilli', 'Coriander', 'Cumin', 'Kasuri Methi', 'Garlic', 'Onion', 'Cardamom', 'Cinnamon'],
                nutritionalInfo: { energy: '410 kcal', protein: '12.5g', carbs: '48g', fat: '18g', sodium: '60mg' },
                variants: [
                    { size: '100g', unit: 'g', price: 115, discountPrice: 98, sku: 'SD-PANEER-100', stock: 160 },
                    { size: '250g', unit: 'g', price: 270, discountPrice: 235, sku: 'SD-PANEER-250', stock: 105 }
                ],
                images: [],
                isFeatured: true,
                ratingAvg: 4.94,
                ratingCount: 168
            },
            {
                name: 'Subhadarshini Mumbai Pav Bhaji Masala',
                slug: 'subhadarshini-mumbai-pav-bhaji-masala',
                category: blendedCat,
                shortDescription: 'Tangy, spicy street-style aromatic blend for authentic buttery Pav Bhaji.',
                fullDescription: 'Authentic Chowpatty-style Pav Bhaji spice blend loaded with dry mango, Kashmiri chilli, black pepper, fennel, and cumin. Gives your homemade mashed veg bhaji rich red hue and lip-smacking flavour.',
                ingredients: ['Coriander', 'Chilli', 'Dry Mango', 'Cumin', 'Fennel', 'Black Pepper', 'Clove', 'Cassia', 'Star Anise'],
                nutritionalInfo: { energy: '345 kcal', protein: '10.1g', carbs: '57g', fat: '7.8g', sodium: '55mg' },
                variants: [
                    { size: '100g', unit: 'g', price: 80, discountPrice: 70, sku: 'SD-PAV-100', stock: 190 },
                    { size: '250g', unit: 'g', price: 185, discountPrice: 165, sku: 'SD-PAV-250', stock: 125 }
                ],
                images: [],
                isFeatured: false,
                ratingAvg: 4.88,
                ratingCount: 112
            },
            {
                name: 'Subhadarshini Punjabi Rajma Masala',
                slug: 'subhadarshini-punjabi-rajma-masala',
                category: blendedCat,
                shortDescription: 'Rich Punjabi-style kidney bean spice blend infused with dry ginger and amchur.',
                fullDescription: 'Specially formulated for North Indian Rajma Chawal. Balanced combination of pomegranate seed powder, amchur, coriander, and black cardamom for thick savory gravy.',
                ingredients: ['Coriander', 'Amchur', 'Pomegranate Seed', 'Cumin', 'Dry Ginger', 'Red Chilli', 'Black Cardamom', 'Nutmeg'],
                nutritionalInfo: { energy: '350 kcal', protein: '11g', carbs: '58g', fat: '7.5g', sodium: '45mg' },
                variants: [
                    { size: '100g', unit: 'g', price: 85, discountPrice: 75, sku: 'SD-RAJMA-100', stock: 170 },
                    { size: '250g', unit: 'g', price: 195, discountPrice: 170, sku: 'SD-RAJMA-250', stock: 115 }
                ],
                images: [],
                isFeatured: false,
                ratingAvg: 4.89,
                ratingCount: 98
            },
            {
                name: 'Subhadarshini Dal Tadka & Fry Masala',
                slug: 'subhadarshini-dal-tadka-masala',
                category: blendedCat,
                shortDescription: 'Smoky roasted cumin, hing, and garlic blend for dhaba-style yellow dal tadka.',
                fullDescription: 'Crafted for arhar/toor dal, moong dal, and chana dal tadka. Infuses smoky restaurant-style tempering flavour directly into cooked lentils.',
                ingredients: ['Roasted Cumin', 'Asafoetida (Hing)', 'Garlic Powder', 'Coriander', 'Red Chilli', 'Turmeric', 'Dry Mango'],
                nutritionalInfo: { energy: '335 kcal', protein: '12g', carbs: '55g', fat: '6.8g', sodium: '48mg' },
                variants: [
                    { size: '100g', unit: 'g', price: 75, discountPrice: 65, sku: 'SD-DALT-100', stock: 210 },
                    { size: '250g', unit: 'g', price: 175, discountPrice: 150, sku: 'SD-DALT-250', stock: 140 }
                ],
                images: [],
                isFeatured: false,
                ratingAvg: 4.87,
                ratingCount: 104
            },
            {
                name: 'Subhadarshini Coastal Fish Fry & Roast Masala',
                slug: 'subhadarshini-coastal-fish-fry-masala',
                category: blendedCat,
                shortDescription: 'Crispy coastal marinade spice blend with kokum, red chilli, and roasted garlic.',
                fullDescription: 'Specialty marinade spice mix for pan-fried fish, rava fish fry, and prawn roast. Ensures crispy golden coating with tangy spicy notes.',
                ingredients: ['Kashmiri Red Chilli', 'Kokum Powder', 'Rice Flour', 'Roasted Garlic', 'Cumin', 'Black Pepper', 'Turmeric', 'Fennel'],
                nutritionalInfo: { energy: '325 kcal', protein: '9.5g', carbs: '60g', fat: '5.2g', sodium: '50mg' },
                variants: [
                    { size: '100g', unit: 'g', price: 95, discountPrice: 82, sku: 'SD-FFRY-100', stock: 175 },
                    { size: '250g', unit: 'g', price: 220, discountPrice: 190, sku: 'SD-FFRY-250', stock: 115 }
                ],
                images: [],
                isFeatured: true,
                ratingAvg: 4.91,
                ratingCount: 145
            },
            {
                name: 'Subhadarshini Fish Curry Masala (Machha Jhola)',
                slug: 'subhadarshini-fish-curry-masala',
                category: blendedCat,
                shortDescription: 'Traditional Odia mustard-fennel blend for authentic mustard fish curries.',
                fullDescription: 'Authentic Machha Jhola masala crafted with yellow mustard, cumin, dried mango powder (amchur), and turmeric for traditional seafood curries.',
                ingredients: ['Mustard', 'Cumin', 'Turmeric', 'Red Chilli', 'Amchur', 'Coriander', 'Fennel'],
                nutritionalInfo: { energy: '345 kcal', protein: '9.8g', carbs: '51g', fat: '11.2g', sodium: '42mg' },
                variants: [
                    { size: '100g', unit: 'g', price: 85, discountPrice: 75, sku: 'SD-FISH-100', stock: 180 },
                    { size: '250g', unit: 'g', price: 195, discountPrice: 175, sku: 'SD-FISH-250', stock: 105 }
                ],
                images: [],
                isFeatured: false,
                ratingAvg: 4.87,
                ratingCount: 92
            },
            {
                name: 'Subhadarshini Sambar Masala',
                slug: 'subhadarshini-sambar-masala',
                category: blendedCat,
                shortDescription: 'Roasted chana dal, fenugreek & Kashmiri chilli blend for authentic sambar.',
                fullDescription: 'Slow-roasted lentils, curry leaves, hing (asafoetida), and whole red chillies milled into fragrant sambar powder.',
                ingredients: ['Coriander', 'Red Chilli', 'Chana Dal', 'Urad Dal', 'Cumin', 'Fenugreek', 'Asafoetida', 'Curry Leaves'],
                nutritionalInfo: { energy: '330 kcal', protein: '13.5g', carbs: '56g', fat: '6.5g', sodium: '35mg' },
                variants: [
                    { size: '100g', unit: 'g', price: 75, discountPrice: 65, sku: 'SD-SAMB-100', stock: 160 },
                    { size: '250g', unit: 'g', price: 175, discountPrice: 155, sku: 'SD-SAMB-250', stock: 95 }
                ],
                images: [],
                isFeatured: false,
                ratingAvg: 4.82,
                ratingCount: 78
            },
            {
                name: 'Subhadarshini Sabji / Veg Curry Masala',
                slug: 'subhadarshini-sabji-masala',
                category: blendedCat,
                shortDescription: 'All-purpose flavorful spice blend for daily vegetable stir-fries and gravies.',
                fullDescription: 'A balanced blend of mild aromatic spices designed to enhance dry vegetable curries, paneer dishes, and mixed veg gravies.',
                ingredients: ['Coriander', 'Cumin', 'Dry Mango', 'Red Chilli', 'Black Pepper', 'Turmeric', 'Ginger'],
                nutritionalInfo: { energy: '340 kcal', protein: '10.5g', carbs: '58g', fat: '8.2g', sodium: '40mg' },
                variants: [
                    { size: '100g', unit: 'g', price: 65, discountPrice: 58, sku: 'SD-SABJ-100', stock: 210 },
                    { size: '250g', unit: 'g', price: 150, discountPrice: 135, sku: 'SD-SABJ-250', stock: 140 }
                ],
                images: [],
                isFeatured: false,
                ratingAvg: 4.8,
                ratingCount: 88
            },
            {
                name: 'Subhadarshini Chana Masala',
                slug: 'subhadarshini-chana-masala',
                category: blendedCat,
                shortDescription: 'Tangy amchur & pomegranate seed blend for restaurant-style chole.',
                fullDescription: 'Infused with roasted pomegranate seeds (anardana), amchur, and black salt for rich, dark Punjabi-style chickpea curries.',
                ingredients: ['Coriander', 'Dry Mango', 'Pomegranate Seed', 'Cumin', 'Red Chilli', 'Black Salt', 'Black Pepper', 'Cinnamon'],
                nutritionalInfo: { energy: '350 kcal', protein: '11.2g', carbs: '59g', fat: '7.8g', sodium: '120mg' },
                variants: [
                    { size: '100g', unit: 'g', price: 80, discountPrice: 70, sku: 'SD-CHAN-100', stock: 170 },
                    { size: '250g', unit: 'g', price: 185, discountPrice: 165, sku: 'SD-CHAN-250', stock: 110 }
                ],
                images: [],
                isFeatured: false,
                ratingAvg: 4.86,
                ratingCount: 94
            },
            {
                name: 'Subhadarshini Egg Curry Masala',
                slug: 'subhadarshini-egg-curry-masala',
                category: blendedCat,
                shortDescription: 'Rich onion-garlic balanced spice for fried egg curries and omelet gravies.',
                fullDescription: 'Specially crafted to complement boiled & fried egg curries. Enhances gravy thickness and gives mouthwatering aroma.',
                ingredients: ['Coriander', 'Cumin', 'Red Chilli', 'Turmeric', 'Onion Powder', 'Garlic Powder', 'Cassia', 'Clove'],
                nutritionalInfo: { energy: '355 kcal', protein: '10.8g', carbs: '57g', fat: '9.1g', sodium: '45mg' },
                variants: [
                    { size: '100g', unit: 'g', price: 75, discountPrice: 65, sku: 'SD-EGG-100', stock: 165 },
                    { size: '250g', unit: 'g', price: 175, discountPrice: 155, sku: 'SD-EGG-250', stock: 100 }
                ],
                images: [],
                isFeatured: false,
                ratingAvg: 4.84,
                ratingCount: 71
            },
            {
                name: 'Subhadarshini Shahi Reserve Garam Masala',
                slug: 'subhadarshini-shahi-reserve-garam-masala',
                category: blendedCat,
                shortDescription: 'Ultra-premium royal whole spice blend with green cardamom pods, rose petals, mace & Kashmiri saffron.',
                fullDescription: 'The crown jewel of Subhadarshini spice mastercrafters. Micro-batched using whole green cardamom pods, dried organic rose petals, saffron threads, mace, nutmeg, and Ceylon cinnamon.',
                ingredients: ['Green Cardamom', 'Kashmiri Saffron', 'Organic Rose Petals', 'Mace', 'Nutmeg', 'Ceylon Cinnamon', 'Cloves', 'Star Anise', 'Black Pepper'],
                nutritionalInfo: { energy: '395 kcal', protein: '11.8g', carbs: '50g', fat: '15.2g', sodium: '35mg' },
                variants: [
                    { size: '100g', unit: 'g', price: 160, discountPrice: 135, sku: 'SD-SHAHI-100', stock: 140 },
                    { size: '250g', unit: 'g', price: 380, discountPrice: 325, sku: 'SD-SHAHI-250', stock: 85 }
                ],
                images: [],
                isFeatured: true,
                ratingAvg: 4.99,
                ratingCount: 310
            },
            // Whole Spices
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
                images: [],
                isFeatured: false,
                ratingAvg: 4.85,
                ratingCount: 64
            },
            {
                name: 'Subhadarshini Mustard Seeds (Soriso / Rai)',
                slug: 'subhadarshini-mustard-seeds',
                category: wholeCat,
                shortDescription: 'Cleaned black mustard seeds with crackling tempering aroma.',
                fullDescription: 'Premium bold black mustard seeds selected for sharp pungency when crackled in hot mustard oil or ghee.',
                ingredients: ['100% Whole Black Mustard Seeds'],
                nutritionalInfo: { energy: '508 kcal', protein: '26g', carbs: '28g', fat: '36g', sodium: '12mg' },
                variants: [
                    { size: '100g', unit: 'g', price: 45, discountPrice: 38, sku: 'SD-RAI-100', stock: 240 },
                    { size: '250g', unit: 'g', price: 100, discountPrice: 88, sku: 'SD-RAI-250', stock: 170 }
                ],
                images: [],
                isFeatured: false,
                ratingAvg: 4.82,
                ratingCount: 52
            },
            {
                name: 'Subhadarshini Whole Black Peppercorns',
                slug: 'subhadarshini-whole-black-pepper',
                category: wholeCat,
                shortDescription: 'Handpicked Tellicherry bold black peppercorns from Malabar.',
                fullDescription: 'Sun-dried high essential oil peppercorns yielding sharp, woody warmth when freshly cracked.',
                ingredients: ['100% Whole Black Peppercorns'],
                nutritionalInfo: { energy: '255 kcal', protein: '10.9g', carbs: '64g', fat: '3.3g', sodium: '20mg' },
                variants: [
                    { size: '100g', unit: 'g', price: 135, discountPrice: 118, sku: 'SD-WPEP-100', stock: 160 },
                    { size: '250g', unit: 'g', price: 310, discountPrice: 275, sku: 'SD-WPEP-250', stock: 110 }
                ],
                images: [],
                isFeatured: false,
                ratingAvg: 4.91,
                ratingCount: 84
            },
            {
                name: 'Subhadarshini Green Cardamom Pods (Elaichi)',
                slug: 'subhadarshini-green-cardamom',
                category: wholeCat,
                shortDescription: 'Aromatic 8mm jumbo green cardamom pods from Idukki, Kerala.',
                fullDescription: 'Naturally sun-cured green cardamom pods bursting with sweet, eucalyptus aromatic essential oils.',
                ingredients: ['100% Whole Green Cardamom Pods'],
                nutritionalInfo: { energy: '311 kcal', protein: '10.8g', carbs: '68g', fat: '6.7g', sodium: '18mg' },
                variants: [
                    { size: '50g', unit: 'g', price: 190, discountPrice: 168, sku: 'SD-CARD-50', stock: 140 },
                    { size: '100g', unit: 'g', price: 360, discountPrice: 320, sku: 'SD-CARD-100', stock: 90 }
                ],
                images: [],
                isFeatured: true,
                ratingAvg: 4.96,
                ratingCount: 135
            },
            {
                name: 'Subhadarshini Whole Cloves (Langa)',
                slug: 'subhadarshini-whole-cloves',
                category: wholeCat,
                shortDescription: 'Hand-sorted whole clove buds with unopened heads and high eugenol.',
                fullDescription: 'Premium handpicked aromatic cloves with full round heads, rich in natural eugenol oil.',
                ingredients: ['100% Whole Clove Buds'],
                nutritionalInfo: { energy: '274 kcal', protein: '6g', carbs: '65g', fat: '13g', sodium: '24mg' },
                variants: [
                    { size: '50g', unit: 'g', price: 110, discountPrice: 95, sku: 'SD-CLOVE-50', stock: 150 },
                    { size: '100g', unit: 'g', price: 210, discountPrice: 185, sku: 'SD-CLOVE-100', stock: 100 }
                ],
                images: [],
                isFeatured: false,
                ratingAvg: 4.89,
                ratingCount: 68
            },
            // Gourmet Seasonings
            {
                name: 'Subhadarshini Posto / Poppy Seed Base Powder',
                slug: 'subhadarshini-posto-poppy-seed',
                category: gourmetCat,
                shortDescription: 'Pure ground poppy seed powder for rich, velvety Odia & Bengali gravies.',
                fullDescription: 'Finely processed white poppy seed powder. Eliminates the hassle of soaking and grinding whole posto seeds at home.',
                ingredients: ['100% Pure White Poppy Seeds'],
                nutritionalInfo: { energy: '525 kcal', protein: '18g', carbs: '28g', fat: '41g', sodium: '26mg' },
                variants: [
                    { size: '100g', unit: 'g', price: 180, discountPrice: 160, sku: 'SD-POSTO-100', stock: 130 },
                    { size: '250g', unit: 'g', price: 420, discountPrice: 380, sku: 'SD-POSTO-250', stock: 80 }
                ],
                images: [],
                isFeatured: true,
                ratingAvg: 4.94,
                ratingCount: 156
            },
            {
                name: 'Subhadarshini Roasted Cumin-Chilli Powder (Bhaja Jeera Lanka)',
                slug: 'subhadarshini-roasted-bhaja-jeera-lanka',
                category: gourmetCat,
                shortDescription: 'Traditional Odia dry roasted cumin & red chilli seasoning for Dalma, Dahi Vada & Chaat.',
                fullDescription: 'Handcrafted according to authentic Odia household heritage recipes. Slow dry-roasted cumin seeds and dry red chillies coarsely ground for finishing Dalma, Dahi Vada, Ghuguni, and snacks.',
                ingredients: ['Dry Roasted Cumin Seeds', 'Dry Roasted Red Chillies'],
                nutritionalInfo: { energy: '360 kcal', protein: '14g', carbs: '50g', fat: '15g', sodium: '45mg' },
                variants: [
                    { size: '100g', unit: 'g', price: 90, discountPrice: 80, sku: 'SD-BHAJA-100', stock: 200 },
                    { size: '250g', unit: 'g', price: 210, discountPrice: 188, sku: 'SD-BHAJA-250', stock: 140 }
                ],
                images: [],
                isFeatured: true,
                ratingAvg: 4.98,
                ratingCount: 240
            },
            {
                name: 'Subhadarshini Heritage Odia Dalma Masala',
                slug: 'subhadarshini-heritage-odia-dalma-masala',
                category: gourmetCat,
                shortDescription: 'Traditional slow-roasted cumin, bay leaf, and red chilli finishing spice for signature Odia Dalma.',
                fullDescription: 'Prepared using age-old temple and household recipes of Odisha. Dry roasted cumin, bay leaves, dry red chillies, and ginger powder ground coarsely to sprinkle over boiling vegetable lentils (Dalma).',
                ingredients: ['Dry Roasted Cumin', 'Roasted Bay Leaf', 'Sun-dried Red Chilli', 'Dry Ginger Powder'],
                nutritionalInfo: { energy: '355 kcal', protein: '13.2g', carbs: '52g', fat: '12g', sodium: '30mg' },
                variants: [
                    { size: '100g', unit: 'g', price: 95, discountPrice: 85, sku: 'SD-DALMA-100', stock: 230 },
                    { size: '250g', unit: 'g', price: 225, discountPrice: 198, sku: 'SD-DALMA-250', stock: 160 }
                ],
                images: [],
                isFeatured: true,
                ratingAvg: 4.99,
                ratingCount: 285
            },
            {
                name: 'Subhadarshini Tangy Special Chaat Masala',
                slug: 'subhadarshini-tangy-special-chaat-masala',
                category: gourmetCat,
                shortDescription: 'Zingy black salt, dried mango powder, and mint spice for fruits, snacks, and street food.',
                fullDescription: 'Piquant condiment seasoning featuring Himalayan black salt, green amchur, cumin, mint, and hing. Instantly transforms salads, fruits, paneer tikka, and snacks.',
                ingredients: ['Black Salt', 'Dry Mango Powder', 'Cumin', 'Mint Leaves', 'Asafoetida', 'Pomegranate Seed', 'Black Pepper'],
                nutritionalInfo: { energy: '220 kcal', protein: '5g', carbs: '45g', fat: '3g', sodium: '850mg' },
                variants: [
                    { size: '100g', unit: 'g', price: 70, discountPrice: 60, sku: 'SD-CHAAT-100', stock: 200 },
                    { size: '250g', unit: 'g', price: 160, discountPrice: 140, sku: 'SD-CHAAT-250', stock: 130 }
                ],
                images: [],
                isFeatured: false,
                ratingAvg: 4.93,
                ratingCount: 154
            },
            {
                name: 'Subhadarshini Kasuri Methi (Dried Fenugreek Leaves)',
                slug: 'subhadarshini-kasuri-methi',
                category: gourmetCat,
                shortDescription: 'Sun-dried Nagauri Kasuri Methi leaves for rich aroma in rich gravies and parathas.',
                fullDescription: 'Handpicked dried fenugreek leaves from Nagaur, Rajasthan. Crushed between palms and sprinkled over butter chicken, paneer gravies, and dal fry for authentic restaurant fragrance.',
                ingredients: ['100% Dried Fenugreek Leaves'],
                nutritionalInfo: { energy: '270 kcal', protein: '20g', carbs: '40g', fat: '4.5g', sodium: '60mg' },
                variants: [
                    { size: '50g', unit: 'g', price: 55, discountPrice: 48, sku: 'SD-METHI-50', stock: 220 },
                    { size: '100g', unit: 'g', price: 100, discountPrice: 88, sku: 'SD-METHI-100', stock: 150 }
                ],
                images: [],
                isFeatured: false,
                ratingAvg: 4.95,
                ratingCount: 160
            },
            // Whole Spices — remaining SKUs from the official catalogue
            {
                name: 'Subhadarshini Tej Patta (Bay Leaf)',
                slug: 'subhadarshini-tej-patta',
                category: wholeCat,
                shortDescription: 'Hand-sorted aromatic bay leaves with a warm, clove-like fragrance.',
                fullDescription: 'Subhadarshini Tej Patta is sun-dried and hand-sorted to retain its glossy green colour and warm aroma. An essential tempering leaf for biryani, pulao, dal and slow-cooked curries.',
                ingredients: ['100% Natural Bay Leaves'],
                nutritionalInfo: { energy: '313 kcal', protein: '7.6g', carbs: '75g', fat: '8.4g', sodium: '23mg' },
                variants: [
                    { size: '25g', unit: 'g', price: 35, discountPrice: 30, sku: 'SD-TEJP-25', stock: 260 },
                    { size: '50g', unit: 'g', price: 60, discountPrice: 52, sku: 'SD-TEJP-50', stock: 180 }
                ],
                images: [],
                isFeatured: false,
                ratingAvg: 4.8,
                ratingCount: 64
            },
            {
                name: 'Subhadarshini Panch Phoran (Five Spice Blend)',
                slug: 'subhadarshini-panch-phoran',
                category: wholeCat,
                shortDescription: 'Classic eastern-Indian five-seed tempering mix in equal measure.',
                fullDescription: 'Subhadarshini Panch Phoran combines cumin, fennel, fenugreek, nigella and mustard seeds in the traditional Odia-Bengali proportion. Bloom it in hot oil to open up the full aroma before adding vegetables or dal.',
                ingredients: ['Cumin Seeds', 'Fennel Seeds', 'Fenugreek Seeds', 'Nigella Seeds', 'Mustard Seeds'],
                nutritionalInfo: { energy: '380 kcal', protein: '17g', carbs: '44g', fat: '16g', sodium: '30mg' },
                variants: [
                    { size: '100g', unit: 'g', price: 70, discountPrice: 60, sku: 'SD-PNCH-100', stock: 240 },
                    { size: '200g', unit: 'g', price: 130, discountPrice: 112, sku: 'SD-PNCH-200', stock: 160 }
                ],
                images: [],
                isFeatured: true,
                ratingAvg: 4.9,
                ratingCount: 108
            },
            {
                name: 'Subhadarshini Whole Red Chilli (Sukhua Lanka)',
                slug: 'subhadarshini-whole-red-chilli',
                category: wholeCat,
                shortDescription: 'Sun-dried whole red chillies with deep colour and balanced heat.',
                fullDescription: 'Subhadarshini Whole Red Chilli is sun-dried on raised platforms to keep the skin bright and free of moisture. Ideal for tempering, chutneys and home-ground chilli powder.',
                ingredients: ['100% Sun-Dried Red Chillies'],
                nutritionalInfo: { energy: '282 kcal', protein: '13g', carbs: '50g', fat: '14g', sodium: '30mg' },
                variants: [
                    { size: '100g', unit: 'g', price: 85, discountPrice: 74, sku: 'SD-WRCH-100', stock: 200 },
                    { size: '250g', unit: 'g', price: 195, discountPrice: 170, sku: 'SD-WRCH-250', stock: 130 }
                ],
                images: [],
                isFeatured: false,
                ratingAvg: 4.85,
                ratingCount: 76
            },
            {
                name: 'Subhadarshini Coriander Seeds (Dhania Sabut)',
                slug: 'subhadarshini-coriander-seeds',
                category: wholeCat,
                shortDescription: 'Plump, aromatic coriander seeds graded for uniform size.',
                fullDescription: 'Subhadarshini Coriander Seeds are cleaned, de-stoned and size-graded so every spoon roasts evenly. Dry-roast and grind fresh for the brightest citrus-woody aroma.',
                ingredients: ['100% Whole Coriander Seeds'],
                nutritionalInfo: { energy: '298 kcal', protein: '12g', carbs: '55g', fat: '17g', sodium: '35mg' },
                variants: [
                    { size: '100g', unit: 'g', price: 55, discountPrice: 48, sku: 'SD-CORS-100', stock: 280 },
                    { size: '500g', unit: 'g', price: 240, discountPrice: 210, sku: 'SD-CORS-500', stock: 140 }
                ],
                images: [],
                isFeatured: false,
                ratingAvg: 4.8,
                ratingCount: 91
            },
            // Premium Food Items
            {
                name: 'Subhadarshini Soya Chunks (High Protein)',
                slug: 'subhadarshini-soya-chunks',
                category: premiumCat,
                shortDescription: '100% vegetarian defatted soya nuggets rich in protein, iron and zinc.',
                fullDescription: 'Subhadarshini Soya Chunks are made from defatted soya flour and deliver a high-protein, cholesterol-free base for curries, pulao and kebabs. Soak in hot water, squeeze and cook.',
                ingredients: ['Defatted Soya Flour'],
                nutritionalInfo: { energy: '345 kcal', protein: '52g', carbs: '33g', fat: '0.5g', sodium: '5mg' },
                variants: [
                    { size: '200g', unit: 'g', price: 55, discountPrice: 48, sku: 'SD-SOYA-200', stock: 300 },
                    { size: '500g', unit: 'g', price: 120, discountPrice: 105, sku: 'SD-SOYA-500', stock: 200 }
                ],
                images: [],
                isFeatured: true,
                ratingAvg: 4.85,
                ratingCount: 210
            },
            {
                name: 'Subhadarshini Hing (Compounded Asafoetida)',
                slug: 'subhadarshini-hing-asafoetida',
                category: premiumCat,
                shortDescription: 'Strong, aromatic compounded asafoetida in an airtight food-grade jar.',
                fullDescription: 'Subhadarshini Hing carries the pungent, savoury aroma that lifts dal, sambar and vegetable tempering. Packed in an airtight jar so the volatile aroma stays locked in.',
                ingredients: ['Asafoetida', 'Edible Starch', 'Edible Gum'],
                nutritionalInfo: { energy: '297 kcal', protein: '4g', carbs: '68g', fat: '1.1g', sodium: '50mg' },
                variants: [
                    { size: '25g', unit: 'g', price: 60, discountPrice: 52, sku: 'SD-HING-25', stock: 260 },
                    { size: '50g', unit: 'g', price: 110, discountPrice: 95, sku: 'SD-HING-50', stock: 170 }
                ],
                images: [],
                isFeatured: false,
                ratingAvg: 4.9,
                ratingCount: 132
            },
            {
                name: 'Subhadarshini Crushed Wheat Daliya',
                slug: 'subhadarshini-crushed-wheat-daliya',
                category: premiumCat,
                shortDescription: 'Coarsely milled whole wheat for wholesome porridge and upma.',
                fullDescription: 'Subhadarshini Daliya is milled from cleaned whole wheat so the bran and germ stay intact. High in fibre and quick to cook — ideal for savoury upma or sweet milk porridge.',
                ingredients: ['100% Whole Wheat'],
                nutritionalInfo: { energy: '342 kcal', protein: '12g', carbs: '76g', fat: '1.5g', sodium: '2mg' },
                variants: [
                    { size: '500g', unit: 'g', price: 65, discountPrice: 56, sku: 'SD-DALI-500', stock: 240 },
                    { size: '1kg', unit: 'kg', price: 120, discountPrice: 105, sku: 'SD-DALI-1000', stock: 150 }
                ],
                images: [],
                isFeatured: false,
                ratingAvg: 4.75,
                ratingCount: 88
            },
            {
                name: 'Subhadarshini Black Salt (Kala Namak)',
                slug: 'subhadarshini-black-salt',
                category: premiumCat,
                shortDescription: 'Kiln-fired rock salt with the classic sulphurous tang.',
                fullDescription: 'Subhadarshini Black Salt is kiln-fired Himalayan rock salt, finely ground for chaat, raita, salads and summer drinks. Adds the unmistakable tangy, savoury note no other salt gives.',
                ingredients: ['Kiln-Fired Rock Salt'],
                nutritionalInfo: { energy: '0 kcal', protein: '0g', carbs: '0g', fat: '0g', sodium: '38000mg' },
                variants: [
                    { size: '100g', unit: 'g', price: 30, discountPrice: 26, sku: 'SD-BSLT-100', stock: 320 },
                    { size: '200g', unit: 'g', price: 55, discountPrice: 48, sku: 'SD-BSLT-200', stock: 210 }
                ],
                images: [],
                isFeatured: false,
                ratingAvg: 4.8,
                ratingCount: 117
            },
            {
                name: 'Subhadarshini Edible Soda (Food Grade)',
                slug: 'subhadarshini-edible-soda',
                category: premiumCat,
                shortDescription: 'Food-grade sodium bicarbonate for softer idli, dhokla and fried snacks.',
                fullDescription: 'Subhadarshini Edible Soda is food-grade sodium bicarbonate, sieved fine so it disperses evenly through batters. Use sparingly for lighter idli, dhokla, pakoda and baked goods.',
                ingredients: ['Food Grade Sodium Bicarbonate'],
                nutritionalInfo: { energy: '0 kcal', protein: '0g', carbs: '0g', fat: '0g', sodium: '27000mg' },
                variants: [
                    { size: '100g', unit: 'g', price: 25, discountPrice: 22, sku: 'SD-SODA-100', stock: 300 },
                    { size: '200g', unit: 'g', price: 45, discountPrice: 39, sku: 'SD-SODA-200', stock: 190 }
                ],
                images: [],
                isFeatured: false,
                ratingAvg: 4.7,
                ratingCount: 54
            },
            {
                name: 'Subhadarshini Corn Flour (Maize Starch)',
                slug: 'subhadarshini-corn-flour',
                category: premiumCat,
                shortDescription: 'Silky maize starch for glossy gravies, soups and crisp coatings.',
                fullDescription: 'Subhadarshini Corn Flour is refined maize starch, double-sieved for a lump-free slurry. Thickens soups and Indo-Chinese gravies and gives fried coatings their crisp finish.',
                ingredients: ['100% Maize Starch'],
                nutritionalInfo: { energy: '381 kcal', protein: '0.3g', carbs: '91g', fat: '0.1g', sodium: '9mg' },
                variants: [
                    { size: '500g', unit: 'g', price: 60, discountPrice: 52, sku: 'SD-CORN-500', stock: 260 },
                    { size: '1kg', unit: 'kg', price: 110, discountPrice: 96, sku: 'SD-CORN-1000', stock: 160 }
                ],
                images: [],
                isFeatured: false,
                ratingAvg: 4.75,
                ratingCount: 72
            },
            // Upcoming Products
            {
                name: 'Subhadarshini Sattu Powder (Coming Soon)',
                slug: 'subhadarshini-sattu-powder',
                category: upcomingCat,
                shortDescription: 'Roasted gram flour drink mix — launching soon.',
                fullDescription: 'Subhadarshini Sattu Powder is stone-ground from slow-roasted Bengal gram. A cooling, high-protein summer drink base and a filling stuffing for litti and paratha. Launching soon.',
                ingredients: ['Roasted Bengal Gram'],
                nutritionalInfo: { energy: '406 kcal', protein: '20g', carbs: '58g', fat: '6g', sodium: '35mg' },
                variants: [
                    { size: '500g', unit: 'g', price: 130, sku: 'SD-SATT-500', stock: 0 }
                ],
                images: [],
                isFeatured: false,
                isUpcoming: true,
                ratingAvg: 5,
                ratingCount: 0
            }
        ];
        // Every product image is resolved from the single canonical catalogue so the
        // seed data and the shipped assets can never drift apart.
        for (const product of productCatalog) {
            product.images = resolveProductImages(product.slug, FALLBACK_IMAGES.ground);
        }
        // Smart Bulk Upsert: Create any products that don't exist yet
        const existingProducts = await Product.find({});
        const existingSlugs = new Set(existingProducts.map((p) => p.slug));
        const toInsert = productCatalog.filter((p) => !existingSlugs.has(p.slug));
        if (toInsert.length > 0) {
            await Product.insertMany(toInsert);
            console.log(`🌶️ [AutoSeed] Successfully seeded ${toInsert.length} new masala products into catalog.`);
        }
        // Bring already-seeded products back in line with this file: corrected
        // artwork, and corrected copy. Only documents that actually differ are
        // written, so this is a no-op once the catalogue is in sync.
        const catalogBySlug = new Map(productCatalog.map((p) => [p.slug, p]));
        const imageFixes = existingProducts
            .flatMap((p) => {
            const def = catalogBySlug.get(p.slug);
            if (!def)
                return [];
            const expectedImages = resolveProductImages(p.slug, '');
            const set = {};
            if (expectedImages.length > 0 && JSON.stringify(p.images) !== JSON.stringify(expectedImages)) {
                set.images = expectedImages;
            }
            if (def.name && p.name !== def.name)
                set.name = def.name;
            if (def.shortDescription && p.shortDescription !== def.shortDescription) {
                set.shortDescription = def.shortDescription;
            }
            if (def.fullDescription && p.fullDescription !== def.fullDescription) {
                set.fullDescription = def.fullDescription;
            }
            if (Object.keys(set).length === 0)
                return [];
            return [{ updateOne: { filter: { _id: p._id }, update: { $set: set } } }];
        });
        if (imageFixes.length > 0) {
            await Product.bulkWrite(imageFixes);
            console.log(`🖼️ [AutoSeed] Synced catalogue copy and images for ${imageFixes.length} products.`);
        }
        const allProducts = await Product.find({});
        // 4. Seed Quality Traceability Batches if empty
        if ((await Batch.countDocuments()) === 0 && allProducts.length > 0) {
            await Batch.create([
                {
                    batchNumber: 'SD2026-SP01',
                    product: allProducts[0]._id,
                    productName: allProducts[0].name,
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
                    facilityLocation: 'Subhadarshini Agro Pvt Ltd, Bhubaneswar, Odisha',
                    isVerified: true
                },
                {
                    batchNumber: 'SD2026-GM04',
                    product: allProducts[Math.min(6, allProducts.length - 1)]._id,
                    productName: allProducts[Math.min(6, allProducts.length - 1)].name,
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
        }
        // 5. Seed Recipes
        const recipeDefs = [
            {
                title: 'Traditional Odia Mamsa Kasa (Spiced Mutton Curry)',
                slug: 'traditional-odia-mamsa-kasa',
                heroProductSlug: 'subhadarshini-mutton-meat-masala',
                category: 'Non-Vegetarian',
                prepTimeMinutes: 20,
                cookTimeMinutes: 45,
                difficulty: 'MEDIUM',
                servings: 4,
                image: RECIPE_IMAGES['traditional-odia-mamsa-kasa'],
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
                    'Garnish with fresh coriander leaves and serve with hot boiled rice or paratha.'
                ],
                requiredProducts: [allProducts[0]._id, allProducts[1]._id, allProducts[2]._id],
                isFeatured: true
            },
            {
                title: 'Heritage Odia Dalma (Lentils with Vegetables)',
                slug: 'heritage-odia-dalma',
                heroProductSlug: 'subhadarshini-heritage-odia-dalma-masala',
                category: 'Vegetarian',
                prepTimeMinutes: 15,
                cookTimeMinutes: 30,
                difficulty: 'EASY',
                servings: 4,
                image: RECIPE_IMAGES['heritage-odia-dalma'],
                description: 'The everyday Odia one-pot of toor dal simmered with raw banana, pumpkin and roasted spice.',
                ingredients: [
                    { name: 'Toor Dal (Arhar)', quantity: '1 cup' },
                    { name: 'Subhadarshini Heritage Odia Dalma Masala', quantity: '1.5 tbsp', isSubhadarshiniProduct: true },
                    { name: 'Subhadarshini Panch Phoran', quantity: '1 tsp', isSubhadarshiniProduct: true },
                    { name: 'Subhadarshini Pure Turmeric Powder', quantity: '1/2 tsp', isSubhadarshiniProduct: true },
                    { name: 'Raw Banana, Pumpkin & Brinjal', quantity: '2 cups, cubed' },
                    { name: 'Fresh Ginger', quantity: '1 inch, grated' },
                    { name: 'Ghee', quantity: '1 tbsp' }
                ],
                instructions: [
                    'Pressure cook the toor dal with turmeric and the cubed vegetables until just tender.',
                    'Heat ghee in a pan and crackle Subhadarshini Panch Phoran with dried red chilli.',
                    'Add grated ginger and fry for thirty seconds until fragrant.',
                    'Pour the tempering into the dal, stir in Subhadarshini Dalma Masala and simmer for five minutes.',
                    'Finish with a spoon of ghee and serve hot with steamed rice.'
                ],
                requiredProducts: [],
                isFeatured: true
            },
            {
                title: 'Machha Besara (Odia Fish Curry in Mustard)',
                slug: 'machha-besara-odia-fish-curry',
                heroProductSlug: 'subhadarshini-fish-curry-masala',
                category: 'Seafood',
                prepTimeMinutes: 15,
                cookTimeMinutes: 25,
                difficulty: 'MEDIUM',
                servings: 4,
                image: RECIPE_IMAGES['machha-besara-odia-fish-curry'],
                description: 'Rohu simmered in a sharp ground-mustard gravy, the coastal Odia classic.',
                ingredients: [
                    { name: 'Rohu or Katla Fish', quantity: '600g, cut into steaks' },
                    { name: 'Subhadarshini Fish Curry Masala', quantity: '2 tbsp', isSubhadarshiniProduct: true },
                    { name: 'Subhadarshini Mustard Seeds', quantity: '2 tbsp, ground to paste', isSubhadarshiniProduct: true },
                    { name: 'Subhadarshini Pure Turmeric Powder', quantity: '1 tsp', isSubhadarshiniProduct: true },
                    { name: 'Mustard Oil', quantity: '4 tbsp' },
                    { name: 'Garlic Cloves', quantity: '6, crushed' },
                    { name: 'Green Chillies', quantity: '3, slit' }
                ],
                instructions: [
                    'Rub the fish steaks with turmeric and salt, then rest for ten minutes.',
                    'Shallow fry the fish in hot mustard oil until lightly golden on both sides, then set aside.',
                    'In the same oil, fry crushed garlic and green chillies until aromatic.',
                    'Add the ground mustard paste and Subhadarshini Fish Curry Masala, and cook on low heat so the mustard does not turn bitter.',
                    'Slide the fish back in with a cup of warm water and simmer for eight minutes. Serve with rice.'
                ],
                requiredProducts: [],
                isFeatured: true
            }
        ];
        // Upsert by slug so recipes added later reach databases that were seeded
        // before them, and so corrected artwork replaces the old value.
        const productIdBySlug = new Map(allProducts.map((p) => [p.slug, p._id]));
        for (const rawDef of recipeDefs) {
            const { heroProductSlug, ...def } = rawDef;
            const heroProduct = heroProductSlug ? productIdBySlug.get(heroProductSlug) : undefined;
            const existing = await Recipe.findOne({ slug: def.slug });
            if (!existing) {
                await Recipe.create({ ...def, heroProduct });
            }
            else {
                // Keep house recipes in step with this file, and make sure recipes
                // seeded before moderation existed are explicitly published.
                existing.image = def.image;
                existing.title = def.title;
                if (!existing.status)
                    existing.status = 'APPROVED';
                if (!existing.source)
                    existing.source = 'HOUSE';
                if (heroProduct && String(existing.heroProduct || '') !== String(heroProduct)) {
                    existing.heroProduct = heroProduct;
                }
                if (existing.isModified())
                    await existing.save();
            }
        }
        // 6. Seed Dealers if empty
        if ((await Dealer.countDocuments()) === 0) {
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
        }
        // 7. Seed Careers if empty
        if ((await Career.countDocuments()) === 0) {
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
                }
            ]);
        }
        console.log('🎉 [AutoSeed] Subhadarshini product catalog & collections ready!');
    }
    catch (error) {
        console.error('❌ [AutoSeed] Error auto-seeding database:', error);
    }
};
