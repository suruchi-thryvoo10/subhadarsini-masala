import mongoose, { Schema, Document } from 'mongoose';

export interface IInventory extends Document {
  product: mongoose.Types.ObjectId;
  sku: string;
  quantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  lowStockThreshold: number;
  batchNumber: string;
  mfgDate: Date;
  expiryDate: Date;
  updatedAt: Date;
}

const InventorySchema = new Schema<IInventory>(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
    sku: { type: String, required: true, unique: true, index: true },
    quantity: { type: Number, required: true, default: 0 },
    reservedQuantity: { type: Number, required: true, default: 0 },
    availableQuantity: { type: Number, required: true, default: 0 },
    lowStockThreshold: { type: Number, default: 20 },
    batchNumber: { type: String, required: true },
    mfgDate: { type: Date, required: true },
    expiryDate: { type: Date, required: true }
  },
  { timestamps: true }
);

export const Inventory = mongoose.model<IInventory>('Inventory', InventorySchema);
