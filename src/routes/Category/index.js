const router = require('express').Router();
const CategoryController = require('../../controllers/Category');

router.post('/', CategoryController.createCategory);
router.get('/', CategoryController.getCategory);
router.get('/:categoryId/product', CategoryController.createCategory);
router.patch('/:categoryId', CategoryController.createCategory);
router.delete('/:categoryId', CategoryController.createCategory);

const categoryRoutes = router;

module.exports = categoryRoutes;
