import { Router } from 'express';

// Controllers
import controllers from '@server/controllers/App';

const router = Router();

// Get
router.get('/', controllers.projects.shortlist);
router.get('/:projectID', controllers.projects.info);

export default router;
