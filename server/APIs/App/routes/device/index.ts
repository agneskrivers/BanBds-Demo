import { Router } from 'express';

// Controllers
import controllers from '@server/controllers/App';

// Middleware
import middleware from '@server/middleware/App';

const router = Router();

// Get
router.get('/', middleware.device, controllers.device.daily);

// Post
router.post('/', controllers.device.renew.info);
router.post('/:deviceID', controllers.device.renew.deviceID);

// Put
router.put('/:deviceID', middleware.device, controllers.device.update);

export default router;
