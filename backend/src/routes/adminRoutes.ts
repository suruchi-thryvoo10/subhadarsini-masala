import { Router } from 'express';
import {
  getDashboardStats,
  getAdminProducts,
  createProduct,
  updateProduct,
  getAdminOrders,
  updateOrderStatus,
  getAdminBatches,
  createBatch,
  getAuditLogs,
  getRecipeSubmissions,
  reviewRecipeSubmission,
  getAdminEnquiries
} from '../controllers/adminController.js';
import { authenticateJWT, requireRole } from '../middlewares/auth.js';

const router = Router();

// Protect all admin routes with JWT and Admin/Manager role check
router.use(authenticateJWT);
router.use(requireRole(['ADMIN', 'MANAGER', 'CONTENT_MANAGER', 'INVENTORY_MANAGER']));

router.get('/stats', getDashboardStats);

router.get('/products', getAdminProducts);
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);

router.get('/orders', getAdminOrders);
router.put('/orders/:id/status', updateOrderStatus);

router.get('/batches', getAdminBatches);
router.post('/batches', createBatch);

router.get('/recipe-submissions', getRecipeSubmissions);
router.put('/recipe-submissions/:id/review', reviewRecipeSubmission);

router.get('/enquiries', getAdminEnquiries);

router.get('/audit-logs', getAuditLogs);

export default router;
