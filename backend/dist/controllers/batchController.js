import { Batch } from '../models/Batch.js';
import { AppError } from '../middlewares/errorHandler.js';
export const verifyBatch = async (req, res, next) => {
    try {
        const { batchNumber } = req.params;
        const batch = await Batch.findOne({
            batchNumber: { $regex: new RegExp(`^${batchNumber.trim()}$`, 'i') }
        }).populate('product', 'name slug images category');
        if (!batch) {
            throw new AppError(`Batch number '${batchNumber}' was not found in Subhadarshini official quality database. Please check the label on your product package.`, 404, 'BATCH_NOT_FOUND');
        }
        res.status(200).json({
            success: true,
            message: 'Batch authenticity & lab certificate verified',
            data: batch
        });
    }
    catch (error) {
        next(error);
    }
};
