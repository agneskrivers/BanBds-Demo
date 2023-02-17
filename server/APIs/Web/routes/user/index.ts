import { Router } from 'express';

// Controllers
import controllers from '@server/controllers/Web';

// Middleware
import middleware from '@server/middleware/Web';

const router = Router();

// Get
router.get('/', middleware, controllers.user.info);

// Post
router.post('/', controllers.user.create);

// Patch
router.patch('/', middleware, controllers.user.update);

export default router;
