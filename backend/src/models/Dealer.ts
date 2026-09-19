import mongoose, { Schema, Document } from 'mongoose';

export interface IDealer extends Document {
  name: string;
  state: string;
  city: string;
  pincode: string;
  address: string;
  phone: string;
  email?: string;
  openingHours: string;
  latitude?: number;
  longitude?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const DealerSchema = new Schema<IDealer>(
  {
    name: { type: String, required: true },
    state: { type: String, required: true, index: true },
    city: { type: String, required: true, index: true },
    pincode: { type: String, required: true, index: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    openingHours: { type: String, default: ' Mon - Sat: 9:00 AM - 8:00 PM' },
    latitude: { type: Number },
    longitude: { type: Number },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const Dealer = mongoose.model<IDealer>('Dealer', DealerSchema);
