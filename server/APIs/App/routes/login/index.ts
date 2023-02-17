import { Router } from 'express';

// Controllers
import controllers from '@server/controllers/App';

const router = Router();

// Get
router.get('/:phoneNumber', controllers.login.send);

// Post
router.post('/:phoneNumber', controllers.login.check);

export default router;
