import mongoose, { Schema, Document } from 'mongoose';

export interface IBatchQualityReport {
  purityScore: string; // e.g. "99.8% Certified Pure"
  moistureLevel: string; // e.g. "6.2%"
  microbialCheck: string; // e.g. "Zero Pathogens Detected"
  labCertifiedBy: string; // e.g. "NABL Accredited Central Spice Lab"
  testedAt: Date;
  certificateNumber: string;
  notes?: string;
}

export interface IBatch extends Document {
  batchNumber: string; // e.g. "SD2026-CHICKEN-01"
  product: mongoose.Types.ObjectId;
  productName: string;
  mfgDate: Date;
  expiryDate: Date;
  qualityReport: IBatchQualityReport;
  facilityLocation: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BatchSchema = new Schema<IBatch>(
  {
    batchNumber: { type: String, required: true, unique: true, index: true },
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    productName: { type: String, required: true },
    mfgDate: { type: Date, required: true },
    expiryDate: { type: Date, required: true },
    qualityReport: {
      purityScore: { type: String, required: true },
      moistureLevel: { type: String, required: true },
      microbialCheck: { type: String, required: true },
      labCertifiedBy: { type: String, required: true },
      testedAt: { type: Date, required: true },
      certificateNumber: { type: String, required: true },
      notes: { type: String }
    },
    facilityLocation: { type: String, default: 'Subhadarshini Agro Pvt Ltd, Bhubaneswar, Odisha' },
    isVerified: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const Batch = mongoose.model<IBatch>('Batch', BatchSchema);
