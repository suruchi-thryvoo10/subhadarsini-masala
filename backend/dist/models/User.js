import mongoose, { Schema } from 'mongoose';
const AddressSchema = new Schema({
    label: { type: String, default: 'Home' },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    isDefault: { type: Boolean, default: false }
});
const UserSchema = new Schema({
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
}, { timestamps: true });
export const User = mongoose.model('User', UserSchema);
