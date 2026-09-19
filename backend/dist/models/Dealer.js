import mongoose, { Schema } from 'mongoose';
const DealerSchema = new Schema({
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
}, { timestamps: true });
export const Dealer = mongoose.model('Dealer', DealerSchema);
