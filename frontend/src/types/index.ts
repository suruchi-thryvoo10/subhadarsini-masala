export type UserRole = 'CUSTOMER' | 'ADMIN' | 'MANAGER' | 'CONTENT_MANAGER' | 'INVENTORY_MANAGER';

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'PACKED'
  | 'SHIPPED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REFUNDED';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  addresses?: Array<{
    label?: string;
    name: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
    isDefault?: boolean;
  }>;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  /** Short hero line on the category landing page. */
  tagline?: string;
  /** Selling points rendered as a strip on the category landing page. */
  highlights?: string[];
  image?: string;
  sortOrder: number;
}

export interface ProductVariant {
  size: string;
  unit: string;
  price: number;
  discountPrice?: number;
  sku: string;
  stock: number;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  category: { _id: string; name: string; slug: string } | string;
  shortDescription: string;
  fullDescription: string;
  ingredients: string[];
  nutritionalInfo: {
    energy: string;
    protein: string;
    carbs: string;
    fat: string;
    sodium?: string;
  };
  variants: ProductVariant[];
  images: string[];
  isFeatured: boolean;
  isUpcoming: boolean;
  isPublished: boolean;
  ratingAvg: number;
  ratingCount: number;
  shelfLife: string;
  storageInstructions: string;
  manufacturerInfo: string;
}


export interface BatchVerification {
  _id: string;
  batchNumber: string;
  productName: string;
  mfgDate: string;
  expiryDate: string;
  qualityReport: {
    purityScore: string;
    moistureLevel: string;
    microbialCheck: string;
    labCertifiedBy: string;
    testedAt: string;
    certificateNumber: string;
    notes?: string;
  };
  facilityLocation: string;
  isVerified: boolean;
}

export interface Recipe {
  _id: string;
  title: string;
  slug: string;
  category: string;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  difficulty: 'EASY' | 'MEDIUM' | 'ADVANCED';
  servings: number;
  image: string;
  description: string;
  ingredients: Array<{
    name: string;
    quantity: string;
    isSubhadarshiniProduct?: boolean;
  }>;
  instructions: string[];
  requiredProducts?: Product[];
  /** The Subhadarshini masala this recipe is built around. */
  heroProduct?: Product;
  videoUrl?: string;
  videoThumbnail?: string;
  source?: 'HOUSE' | 'COMMUNITY';
  submittedBy?: { name?: string; story?: string };
}
