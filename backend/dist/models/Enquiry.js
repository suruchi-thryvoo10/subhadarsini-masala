import mongoose, { Schema } from 'mongoose';
const EnquiryNoteSchema = new Schema({
    author: { type: String, required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});
const EnquirySchema = new Schema({
    type: { type: String, enum: ['WHOLESALE', 'GENERAL', 'DEALER'], default: 'WHOLESALE', index: true },
    name: { type: String, required: true },
    businessName: { type: String },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    city: { type: String, default: 'Not Specified' },
    state: { type: String, default: 'Not Specified' },
    expectedVolume: { type: String },
    address: { type: String },
    pincode: { type: String },
    businessType: { type: String },
    message: { type: String, required: true },
    status: {
        type: String,
        enum: ['NEW', 'CONTACTED', 'NEGOTIATING', 'CONVERTED', 'CLOSED'],
        default: 'NEW',
        index: true
    },
    notes: [EnquiryNoteSchema]
}, { timestamps: true });
export const Enquiry = mongoose.model('Enquiry', EnquirySchema);
