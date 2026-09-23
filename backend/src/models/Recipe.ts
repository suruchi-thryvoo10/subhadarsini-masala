import mongoose, { Schema, Document } from 'mongoose';

export interface IRecipeIngredient {
  name: string;
  quantity: string;
  isSubhadarshiniProduct?: boolean;
  productId?: mongoose.Types.ObjectId;
}

export interface IRecipe extends Document {
  title: string;
  slug: string;
  category: string; // "Non-Veg", "Vegetarian", "Seafood", "Snacks"
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  difficulty: 'EASY' | 'MEDIUM' | 'ADVANCED';
  servings: number;
  image: string;
  description: string;
  ingredients: IRecipeIngredient[];
  instructions: string[];
  requiredProducts: mongoose.Types.ObjectId[];
  /** The one Subhadarshini masala this recipe is built around. */
  heroProduct?: mongoose.Types.ObjectId;
  /** Optional cooking video (YouTube/Vimeo/direct URL) with its own poster. */
  videoUrl?: string;
  videoThumbnail?: string;
  isFeatured: boolean;
  /** Where the recipe came from and whether it may be shown publicly. */
  source: 'HOUSE' | 'COMMUNITY';
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  submittedBy?: {
    name: string;
    email?: string;
    phone?: string;
    story?: string;
  };
  reviewNote?: string;
  createdAt: Date;
  updatedAt: Date;
}

const RecipeIngredientSchema = new Schema<IRecipeIngredient>({
  name: { type: String, required: true },
  quantity: { type: String, default: '' },
  isSubhadarshiniProduct: { type: Boolean, default: false },
  productId: { type: Schema.Types.ObjectId, ref: 'Product' }
});

const RecipeSchema = new Schema<IRecipe>(
  {
    title: { type: String, required: true, index: true },
    slug: { type: String, required: true, unique: true, index: true },
    category: { type: String, required: true },
    prepTimeMinutes: { type: Number, default: 15 },
    cookTimeMinutes: { type: Number, default: 30 },
    difficulty: { type: String, enum: ['EASY', 'MEDIUM', 'ADVANCED'], default: 'EASY' },
    servings: { type: Number, default: 4 },
    image: { type: String, default: '' },
    description: { type: String, required: true },
    ingredients: [RecipeIngredientSchema],
    instructions: [{ type: String, required: true }],
    requiredProducts: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    heroProduct: { type: Schema.Types.ObjectId, ref: 'Product' },
    videoUrl: { type: String },
    videoThumbnail: { type: String },
    source: { type: String, enum: ['HOUSE', 'COMMUNITY'], default: 'HOUSE', index: true },
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED'],
      default: 'APPROVED',
      index: true
    },
    submittedBy: {
      name: { type: String },
      email: { type: String },
      phone: { type: String },
      story: { type: String }
    },
    reviewNote: { type: String },
    isFeatured: { type: Boolean, default: false }
  },
  { timestamps: true }
);

RecipeSchema.index({ title: 'text', description: 'text', 'ingredients.name': 'text' });

export const Recipe = mongoose.model<IRecipe>('Recipe', RecipeSchema);
