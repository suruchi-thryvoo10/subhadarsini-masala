import mongoose, { Schema } from 'mongoose';
const BatchSchema = new Schema({
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
}, { timestamps: true });
export const Batch = mongoose.model('Batch', BatchSchema);
