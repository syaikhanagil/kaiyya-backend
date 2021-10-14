const router = require('express').Router();
const ProductController = require('../../controllers/Product');

router.get('/', ProductController.getProduct);
router.post('/:type', ProductController.getProduct);
router.get('/detail/:slug', ProductController.getProductDetail);

const productRoutes = router;

module.exports = productRoutes;
