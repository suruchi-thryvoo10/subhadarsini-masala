import mongoose, { Schema, Document } from 'mongoose';

export interface IProductVariant {
  size: string; // e.g. "100g", "250g", "500g", "1kg"
  unit: string; // "g" or "kg" or "pack"
  price: number;
  discountPrice?: number;
  sku: string;
  stock: number;
}

export interface INutritionalInfo {
  energy: string;
  protein: string;
  carbs: string;
  fat: string;
  sodium?: string;
}

export interface IProduct extends Document {
  name: string;
  slug: string;
  category: mongoose.Types.ObjectId;
  shortDescription: string;
  fullDescription: string;
  ingredients: string[];
  nutritionalInfo: INutritionalInfo;
  variants: IProductVariant[];
  images: string[];
  isFeatured: boolean;
  isUpcoming: boolean;
  isPublished: boolean;
  ratingAvg: number;
  ratingCount: number;
  shelfLife: string;
  storageInstructions: string;
  manufacturerInfo: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProductVariantSchema = new Schema<IProductVariant>({
  size: { type: String, required: true },
  unit: { type: String, default: 'g' },
  price: { type: Number, required: true },
  discountPrice: { type: Number },
  sku: { type: String, required: true },
  stock: { type: Number, default: 100 }
});

const ProductSchema = new Schema<IProduct>(
  {
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
  },
  { timestamps: true }
);

ProductSchema.index({ name: 'text', shortDescription: 'text', ingredients: 'text' });

// Every public listing filters on isPublished and sorts by featured-then-newest,
// so the compound index lets Mongo satisfy the filter and the sort from one scan.
ProductSchema.index({ isPublished: 1, isFeatured: -1, createdAt: -1 });
ProductSchema.index({ isPublished: 1, category: 1, isFeatured: -1 });
ProductSchema.index({ isPublished: 1, ratingAvg: -1 });

export const Product = mongoose.model<IProduct>('Product', ProductSchema);
