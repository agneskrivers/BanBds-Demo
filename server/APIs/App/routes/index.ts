import { Router } from 'express';

// Controllers
import controllers from '@server/controllers/App';

// Middleware
import middleware from '@server/middleware/App';

// Routes
import DeviceRoute from './device';
import LoginRoute from './login';
import NewsRoute from './news';
import PostsRoute from './posts';
import ProjectsRoute from './projects';
import UserRoute from './user';
import VersionRoute from './version';

const router = Router();

// Use
router.use('/device', DeviceRoute);
router.use('/login', middleware.device, LoginRoute);
router.use('/news', middleware.device, NewsRoute);
router.use('/posts', middleware.device, PostsRoute);
router.use('/projects', middleware.device, ProjectsRoute);
router.use('/user', middleware.device, UserRoute);
router.use('/version', middleware.device, VersionRoute);

// Get
router.get('/dashboard', middleware.device, controllers.dashboard);
router.get('/districts', middleware.device, controllers.districts);
router.get('/regions', middleware.device, controllers.regions);
router.get('/wards', middleware.device, controllers.wards);

// Post
router.post('/init', controllers.init);
router.post(
    '/request',
    middleware.device,
    middleware.user,
    controllers.request
);

export default router;
