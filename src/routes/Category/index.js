const router = require('express').Router();
const CategoryController = require('../../controllers/Category');

router.get('/', CategoryController.getCategory);
router.get('/detail/:slug', CategoryController.getCategoryDetail);

const categoryRoutes = router;

module.exports = categoryRoutes;
