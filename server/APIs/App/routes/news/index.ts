import { Router } from 'express';

// Controllers
import controllers from '@server/controllers/App';

const router = Router();

// Get
router.get('/', controllers.news.shortlist);
router.get('/:id', controllers.news.info);

export default router;
