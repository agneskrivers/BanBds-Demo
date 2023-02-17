import { Router } from 'express';

// Controllers
import controllers from '@server/controllers/App';

// Middleware
import middleware from '@server/middleware/App';

const router = Router();

// Get
router.get('/', controllers.posts.shortlist);
router.get('/my', middleware.user, controllers.posts.myShortlist);
router.get('/info/:postID', controllers.posts.info);
router.get('/info/:postID/my', middleware.user, controllers.posts.myPostInfo);

// Post
router.post('/', middleware.user, controllers.posts.create);

// Put
router.put('/:postID', middleware.user, controllers.posts.update);

// Patch
router.patch('/:postID', middleware.user, controllers.posts.sold);

// Delete
router.delete('/:postID', middleware.user, controllers.posts.remove);

export default router;
