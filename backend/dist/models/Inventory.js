import mongoose, { Schema } from 'mongoose';
const InventorySchema = new Schema({
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
    sku: { type: String, required: true, unique: true, index: true },
    quantity: { type: Number, required: true, default: 0 },
    reservedQuantity: { type: Number, required: true, default: 0 },
    availableQuantity: { type: Number, required: true, default: 0 },
    lowStockThreshold: { type: Number, default: 20 },
    batchNumber: { type: String, required: true },
    mfgDate: { type: Date, required: true },
    expiryDate: { type: Date, required: true }
}, { timestamps: true });
export const Inventory = mongoose.model('Inventory', InventorySchema);
