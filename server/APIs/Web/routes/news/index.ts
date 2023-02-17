import { Router } from 'express';

// Controllers
import controllers from '@server/controllers/Web';

const router = Router();

// Get
router.get('/', controllers.news.shortlist);
router.get('/:id', controllers.news.info);
router.get('/:id/count', controllers.news.count);

export default router;
