const router = require('express').Router();
const PostController = require('../../controllers/Post');

// const FaqController = require('../../controllers/Faq');

router.get('/', PostController.getPost);
router.get('/detail/:slug', PostController.getPostDetail);

const postRoutes = router;

module.exports = postRoutes;
