import { Request, Response, NextFunction } from 'express';
import { Career, Application } from '../models/Career.js';
import { AppError } from '../middlewares/errorHandler.js';

export const getCareers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const careers = await Career.find({ isActive: true }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: careers
    });
  } catch (error) {
    next(error);
  }
};

export const applyJob = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { careerId, jobTitle, name, email, phone, resumeUrl, coverLetter } = req.body;

    if (!careerId || !name || !email || !phone) {
      throw new AppError('Please fill in all required application fields', 400, 'MISSING_FIELDS');
    }

    const application = await Application.create({
      career: careerId,
      jobTitle: jobTitle || 'General Application',
      name,
      email,
      phone,
      resumeUrl,
      coverLetter
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully! Our HR team will review your application.',
      data: application
    });
  } catch (error) {
    next(error);
  }
};
