const router = require('express').Router();
const ProductController = require('../../controllers/Product');

router.get('/', ProductController.getProduct);
router.get('/detail/:slug', ProductController.getProductDetail);

// Route for admin
router.post('/', ProductController.createProduct);
router.patch('/:productId', ProductController.getProductDetail);
router.delete('/:productId', ProductController.deleteProduct);

const productRoutes = router;

module.exports = productRoutes;
