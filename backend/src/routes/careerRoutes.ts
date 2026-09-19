import { Router } from 'express';
import { getCareers, applyJob } from '../controllers/careerController.js';

const router = Router();

router.get('/', getCareers);
router.post('/apply', applyJob);

export default router;
