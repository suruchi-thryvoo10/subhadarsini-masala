import { Router } from 'express';
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  mergeWishlist
} from '../controllers/wishlistController.js';
import { authenticateJWT } from '../middlewares/auth.js';

/** All wishlist routes act on the caller's own account, identified by the JWT. */
const router = Router();

router.use(authenticateJWT);

router.get('/', getWishlist);
router.post('/merge', mergeWishlist);
router.put('/:productId', addToWishlist);
router.delete('/:productId', removeFromWishlist);

export default router;
