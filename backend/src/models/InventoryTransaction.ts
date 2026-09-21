import mongoose, { Schema, Document } from 'mongoose';

export interface IInventoryTransaction extends Document {
  sku: string;
  type: 'INBOUND' | 'ORDER_RESERVED' | 'ORDER_COMPLETED' | 'ADJUSTMENT' | 'RETURN';
  quantity: number;
  reason: string;
  performedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
}

const InventoryTransactionSchema = new Schema<IInventoryTransaction>(
  {
    sku: { type: String, required: true, index: true },
    type: {
      type: String,
      enum: ['INBOUND', 'ORDER_RESERVED', 'ORDER_COMPLETED', 'ADJUSTMENT', 'RETURN'],
      required: true
    },
    quantity: { type: Number, required: true },
    reason: { type: String, required: true },
    performedBy: { type: Schema.Types.ObjectId, ref: 'User' }
    
  },
  { timestamps: true }
);

export const InventoryTransaction = mongoose.model<IInventoryTransaction>('InventoryTransaction', InventoryTransactionSchema);
