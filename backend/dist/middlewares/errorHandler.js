export class AppError extends Error {
    statusCode;
    errorCode;
    constructor(message, statusCode = 500, errorCode = 'INTERNAL_ERROR') {
        super(message);
        this.statusCode = statusCode;
        this.errorCode = errorCode;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
export const globalErrorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let errorCode = err.errorCode || 'INTERNAL_ERROR';
    let message = err.message || 'Something went wrong on the server';
    // Mongoose surfaces an unavailable database as a generic error; translate it so
    // the client gets an accurate status instead of a misleading 500.
    if (err.name === 'MongooseError' || err.name === 'MongoNetworkError' || err.name === 'MongoServerSelectionError') {
        statusCode = 503;
        errorCode = 'DATABASE_UNAVAILABLE';
        message = 'The database is currently unreachable. Please try again shortly.';
    }
    console.error(`[Error] ${req.method} ${req.url} - ${statusCode} [${errorCode}]: ${err.message}`);
    // Stack traces are only exposed on a real local development machine, never on
    // Vercel (where NODE_ENV is not a reliable signal).
    const exposeStack = process.env.NODE_ENV === 'development' && !process.env.VERCEL;
    res.status(statusCode).json({
        success: false,
        message,
        errorCode,
        ...(exposeStack && { stack: err.stack })
    });
};
