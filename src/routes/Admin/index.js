const router = require('express').Router();
const AccountController = require('../../controllers/Account');
const CategoryController = require('../../controllers/Category');
const ProductController = require('../../controllers/Product');
const OrderController = require('../../controllers/Order');

router.post('/login', AccountController.loginAdmin);

// Account Route
router.get('/account', AccountController.getAccounts);
router.get('/account/:userRole', AccountController.getAccountByRole);

// Product Route
router.post('/product', ProductController.createProduct);
router.get('/product', ProductController.getProduct);
router.patch('/product/:productId', ProductController.getProductDetail);
router.delete('/product/:productId', ProductController.deleteProduct);

// Category Controller
router.post('/category', CategoryController.createCategory);
router.get('/category', CategoryController.getCategory);
router.get('/category/:categoryId/product', CategoryController.createCategory);
router.patch('/category/:categoryId', CategoryController.createCategory);
router.delete('/category/:categoryId', CategoryController.createCategory);

router.post('/order/', OrderController.createOrder);
router.get('/order/', OrderController.getOrderData);
router.get('/order/:orderId', OrderController.getOrder);

router.patch('/update-status/:orderId', OrderController.updateOrderStatus);

const adminRoutes = router;

module.exports = adminRoutes;
