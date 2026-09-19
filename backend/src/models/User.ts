import mongoose, { Schema, Document } from 'mongoose';

export interface IUserAddress {
  label?: string;
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  phone?: string;
  role: 'CUSTOMER' | 'ADMIN' | 'MANAGER' | 'CONTENT_MANAGER' | 'INVENTORY_MANAGER';
  addresses: IUserAddress[];
  wishlist: mongoose.Types.ObjectId[];
  isVerified: boolean;
  refreshTokenHash?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AddressSchema = new Schema<IUserAddress>({
  label: { type: String, default: 'Home' },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  isDefault: { type: Boolean, default: false }
});

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true, lowercase: true },
    passwordHash: { type: String, required: true },
    phone: { type: String },
    role: {
      type: String,
      enum: ['CUSTOMER', 'ADMIN', 'MANAGER', 'CONTENT_MANAGER', 'INVENTORY_MANAGER'],
      default: 'CUSTOMER'
    },
    addresses: [AddressSchema],
    wishlist: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    isVerified: { type: Boolean, default: true },
    refreshTokenHash: { type: String }
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', UserSchema);
