import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  statusCode: number;
  errorCode: string;

  constructor(message: string, statusCode = 500, errorCode = 'INTERNAL_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const errorCode = err.errorCode || 'INTERNAL_ERROR';
  const message = err.message || 'Something went wrong on the server';

  console.error(`[Error] ${req.method} ${req.url} - ${statusCode} [${errorCode}]: ${message}`);

  res.status(statusCode).json({
    success: false,
    message,
    errorCode,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
