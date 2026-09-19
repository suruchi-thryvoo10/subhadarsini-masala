import { Router } from 'express';
import { getDealers } from '../controllers/dealerController.js';

const router = Router();

router.get('/', getDealers);

export default router;
