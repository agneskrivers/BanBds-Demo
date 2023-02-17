import { Router } from 'express';

// Controllers
import controllers from '@server/controllers/Web';

// Middleware
import middleware from '@server/middleware/Web';

const router = Router();

// Get
router.get('/count/:postID', controllers.posts.count);
router.get('/', controllers.posts.shortlist);
router.get('/my', middleware, controllers.posts.myShortlist);
router.get('/dashboard', controllers.posts.dashboard);
router.get('/info/:postID', controllers.posts.info);
router.get('/info/:postID/my', middleware, controllers.posts.myPostInfo);

// Post
router.post('/', middleware, controllers.posts.create);

// Put
router.put('/:postID', middleware, controllers.posts.update);

// Patch
router.patch('/:postID', middleware, controllers.posts.sold);

// Delete
router.delete('/:postID', middleware, controllers.posts.remove);

export default router;
