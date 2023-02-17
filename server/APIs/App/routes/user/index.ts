import { Router } from 'express';

// Controllers
import controllers from '@server/controllers/App';

// Middleware
import middleware from '@server/middleware/App';

const router = Router();

// Get
router.get('/', middleware.user, controllers.user.info);

// Post
router.post('/', controllers.user.create);

// Patch
router.patch('/', middleware.user, controllers.user.update);

export default router;
