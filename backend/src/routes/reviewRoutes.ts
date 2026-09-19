import { Router } from 'express';
import { getProductReviews, submitReview } from '../controllers/reviewController.js';
import { authenticateJWT } from '../middlewares/auth.js';

const router = Router();

router.get('/product/:productId', getProductReviews);
router.post('/submit', authenticateJWT, submitReview);

export default router;
