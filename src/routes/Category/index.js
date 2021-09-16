const router = require('express').Router();
const CategoryController = require('../../controllers/Category');

router.get('/', CategoryController.getCategory);
router.get('/:categoryId/product', CategoryController.createCategory);

const categoryRoutes = router;

module.exports = categoryRoutes;
