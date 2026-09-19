import mongoose, { Schema } from 'mongoose';
const CareerSchema = new Schema({
    title: { type: String, required: true },
    department: { type: String, required: true },
    location: { type: String, default: 'Odisha, India' },
    type: { type: String, enum: ['Full-time', 'Part-time', 'Contract'], default: 'Full-time' },
    experience: { type: String, required: true },
    description: { type: String, required: true },
    requirements: [{ type: String }],
    isActive: { type: Boolean, default: true }
}, { timestamps: true });
export const Career = mongoose.model('Career', CareerSchema);
const ApplicationSchema = new Schema({
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
}, { timestamps: true });
export const Application = mongoose.model('Application', ApplicationSchema);
