import mongoose, { Schema } from 'mongoose';
const ProductVariantSchema = new Schema({
    size: { type: String, required: true },
    unit: { type: String, default: 'g' },
    price: { type: Number, required: true },
    discountPrice: { type: Number },
    sku: { type: String, required: true },
    stock: { type: Number, default: 100 }
});
const ProductSchema = new Schema({
    name: { type: String, required: true, index: true },
    slug: { type: String, required: true, unique: true, index: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
    shortDescription: { type: String, required: true },
    fullDescription: { type: String, required: true },
    ingredients: [{ type: String }],
    nutritionalInfo: {
        energy: { type: String, default: '350 kcal / 100g' },
        protein: { type: String, default: '12g' },
        carbs: { type: String, default: '55g' },
        fat: { type: String, default: '10g' },
        sodium: { type: String, default: '35mg' }
    },
    variants: [ProductVariantSchema],
    images: [{ type: String }],
    isFeatured: { type: Boolean, default: false },
    isUpcoming: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: true },
    ratingAvg: { type: Number, default: 4.8 },
    ratingCount: { type: Number, default: 24 },
    shelfLife: { type: String, default: '12 Months from Manufacturing Date' },
    storageInstructions: { type: String, default: 'Store in a cool, dry place away from direct sunlight in an airtight container.' },
    manufacturerInfo: { type: String, default: 'Subhadarshini Agro Pvt Ltd, N3/394, IRC Village, Nayapalli, Bhubaneswar - 751015, Odisha, India' }
}, { timestamps: true });
ProductSchema.index({ name: 'text', shortDescription: 'text', ingredients: 'text' });
export const Product = mongoose.model('Product', ProductSchema);
