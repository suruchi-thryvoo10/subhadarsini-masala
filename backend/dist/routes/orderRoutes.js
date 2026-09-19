import { Router } from 'express';
import { createOrder, trackOrder, getMyOrders } from '../controllers/orderController.js';
import { authenticateJWT } from '../middlewares/auth.js';
const router = Router();
router.post('/create', createOrder);
router.get('/track/:orderNumber', trackOrder);
router.get('/my-orders', authenticateJWT, getMyOrders);
export default router;
