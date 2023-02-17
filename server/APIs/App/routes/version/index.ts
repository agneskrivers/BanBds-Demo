import { Router } from 'express';

// Controllers
import controllers from '@server/controllers/App';

const router = Router();

// Get
router.get('/', controllers.version.check);
router.get('/link', controllers.version.link);

export default router;
