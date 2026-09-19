import { Router } from 'express';
import { verifyBatch } from '../controllers/batchController.js';
const router = Router();
router.get('/batch/:batchNumber', verifyBatch);
export default router;
