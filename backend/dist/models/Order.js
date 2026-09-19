import mongoose, { Schema } from 'mongoose';
const OrderItemSchema = new Schema({
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    sku: { type: String, required: true },
    variantSize: { type: String, required: true },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    image: { type: String }
});
const TrackingEventSchema = new Schema({
    status: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    note: { type: String }
});
const OrderSchema = new Schema({
    orderNumber: { type: String, required: true, unique: true, index: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    guestEmail: { type: String },
    items: [OrderItemSchema],
    shippingAddress: {
        name: { type: String, required: true },
        phone: { type: String, required: true },
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        pincode: { type: String, required: true }
    },
    paymentInfo: {
        method: { type: String, enum: ['UPI', 'CARD', 'NETBANKING', 'WALLET', 'COD'], required: true },
        razorpayOrderId: { type: String },
        razorpayPaymentId: { type: String },
        status: { type: String, enum: ['PENDING', 'PAID', 'FAILED', 'REFUNDED'], default: 'PENDING' }
    },
    pricing: {
        subtotal: { type: Number, required: true },
        shippingFee: { type: Number, required: true, default: 0 },
        tax: { type: Number, required: true, default: 0 },
        discount: { type: Number, default: 0 },
        totalAmount: { type: Number, required: true }
    },
    orderStatus: {
        type: String,
        enum: ['PENDING', 'CONFIRMED', 'PROCESSING', 'PACKED', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED', 'REFUNDED'],
        default: 'PENDING',
        index: true
    },
    trackingHistory: [TrackingEventSchema]
}, { timestamps: true });
export const Order = mongoose.model('Order', OrderSchema);
