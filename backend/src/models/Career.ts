import mongoose, { Schema, Document } from 'mongoose';

export interface ICareer extends Document {
  title: string;
  department: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract';
  experience: string;
  description: string;
  requirements: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CareerSchema = new Schema<ICareer>(
  {
    title: { type: String, required: true },
    department: { type: String, required: true },
    location: { type: String, default: 'Odisha, India' },
    type: { type: String, enum: ['Full-time', 'Part-time', 'Contract'], default: 'Full-time' },
    experience: { type: String, required: true },
    description: { type: String, required: true },
    requirements: [{ type: String }],
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const Career = mongoose.model<ICareer>('Career', CareerSchema);

export interface IApplication extends Document {
  career: mongoose.Types.ObjectId;
  jobTitle: string;
  name: string;
  email: string;
  phone: string;
  resumeUrl?: string;
  coverLetter?: string;
  status: 'RECEIVED' | 'UNDER_REVIEW' | 'SHORTLISTED' | 'REJECTED';
  createdAt: Date;
}

const ApplicationSchema = new Schema<IApplication>(
  {
    career: { type: Schema.Types.ObjectId, ref: 'Career', required: true },
    jobTitle: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    resumeUrl: { type: String },
    coverLetter: { type: String },
    status: {
      type: String,
      enum: ['RECEIVED', 'UNDER_REVIEW', 'SHORTLISTED', 'REJECTED'],
      default: 'RECEIVED'
    }
  },
  { timestamps: true }
);

export const Application = mongoose.model<IApplication>('Application', ApplicationSchema);
