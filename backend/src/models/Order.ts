import mongoose, { Schema, Document } from 'mongoose';

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

export interface IOrderItem {
  product: mongoose.Types.ObjectId;
  name: string;
  sku: string;
  variantSize: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  image?: string;
}

export interface ITrackingEvent {
  status: OrderStatus;
  timestamp: Date;
  note?: string;
}

export interface IOrder extends Document {
  orderNumber: string;
  user?: mongoose.Types.ObjectId;
  guestEmail?: string;
  items: IOrderItem[];
  shippingAddress: {
    name: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  paymentInfo: {
    method: 'UPI' | 'CARD' | 'NETBANKING' | 'WALLET' | 'COD';
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
    status: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  };
  pricing: {
    subtotal: number;
    shippingFee: number;
    tax: number;
    discount: number;
    totalAmount: number;
  };
  orderStatus: OrderStatus;
  trackingHistory: ITrackingEvent[];
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  sku: { type: String, required: true },
  variantSize: { type: String, required: true },
  quantity: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  image: { type: String }
});

const TrackingEventSchema = new Schema<ITrackingEvent>({
  status: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  note: { type: String }
});

const OrderSchema = new Schema<IOrder>(
  {
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
  },
  { timestamps: true }
);

export const Order = mongoose.model<IOrder>('Order', OrderSchema);
