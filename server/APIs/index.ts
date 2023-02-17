import { Router } from 'express';

// Routes
import AppRoute from '@server/routes/App';
import CommonRoute from '@server/routes/Common';
import WebRoute from '@server/routes/Web';

const router = Router();

router.use('/app', AppRoute);
router.use('/common', CommonRoute);
router.use('/web', WebRoute);

export default router;
