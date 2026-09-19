import { Request, Response, NextFunction } from 'express';
import { Enquiry } from '../models/Enquiry.js';
import { z } from 'zod';
import { AppError } from '../middlewares/errorHandler.js';

const enquirySchema = z.object({
  type: z.enum(['WHOLESALE', 'GENERAL']).default('WHOLESALE'),
  name: z.string().min(2, 'Name is required'),
  businessName: z.string().optional(),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(7, 'Valid phone number is required'),
  city: z.string().optional().default('Not Specified'),
  state: z.string().optional().default('Not Specified'),
  expectedVolume: z.string().optional(),
  message: z.string().min(5, 'Message is required')
});

export const createEnquiry = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = enquirySchema.parse(req.body);

    const enquiry = await Enquiry.create(validatedData);

    res.status(201).json({
      success: true,
      message: 'Enquiry submitted successfully! Our business team will contact you shortly.',
      data: enquiry
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return next(new AppError(error.errors[0].message, 400, 'VALIDATION_ERROR'));
    }
    next(error);
  }
};
