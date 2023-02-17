import { Router } from 'express';

// Controllers
import controllers from '@server/controllers/Web';

// Routers
import LoginRouter from './login';
import NewsRouter from './news';
import PostsRouter from './posts';
import ProjectsRouter from './projects';
import UserRouter from './user';

// Middleware
import middleware from '@server/middleware/Web';

const router = Router();

// Use
router.use('/login', LoginRouter);
router.use('/news', NewsRouter);
router.use('/posts', PostsRouter);
router.use('/projects', ProjectsRouter);
router.use('/user', UserRouter);

// Get
router.get('/dashboard', controllers.dashboard);
router.get('/district', controllers.district);
router.get('/region', controllers.region);
router.get('/', controllers.first);

// Post
router.post('/request', middleware, controllers.request);

export default router;
