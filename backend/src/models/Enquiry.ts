import mongoose, { Schema, Document } from 'mongoose';

export interface IEnquiryNote {
  author: string;
  text: string;
  createdAt: Date;
}

export interface IEnquiry extends Document {
  type: 'WHOLESALE' | 'GENERAL' | 'DEALER';
  name: string;
  businessName?: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  expectedVolume?: string;
  address?: string;
  pincode?: string;
  businessType?: string;
  message: string;
  status: 'NEW' | 'CONTACTED' | 'NEGOTIATING' | 'CONVERTED' | 'CLOSED';
  notes: IEnquiryNote[];
  createdAt: Date;
  updatedAt: Date;
}

const EnquiryNoteSchema = new Schema<IEnquiryNote>({
  author: { type: String, required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const EnquirySchema = new Schema<IEnquiry>(
  {
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
  },
  { timestamps: true }
);

export const Enquiry = mongoose.model<IEnquiry>('Enquiry', EnquirySchema);
