import mongoose, { Schema } from 'mongoose';
const InventoryTransactionSchema = new Schema({
    sku: { type: String, required: true, index: true },
    type: {
        type: String,
        enum: ['INBOUND', 'ORDER_RESERVED', 'ORDER_COMPLETED', 'ADJUSTMENT', 'RETURN'],
        required: true
    },
    quantity: { type: Number, required: true },
    reason: { type: String, required: true },
    performedBy: { type: Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });
export const InventoryTransaction = mongoose.model('InventoryTransaction', InventoryTransactionSchema);
