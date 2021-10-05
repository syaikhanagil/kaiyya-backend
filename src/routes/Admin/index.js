const router = require('express').Router();
const multer = require('multer');
const AdminController = require('../../controllers/Admin');

router.post('/login', AdminController.login);

// Account Route
router.get('/account', AdminController.getAccounts);
router.get('/account/:userRole', AdminController.getAccountByRole);
router.get('/account/downline/:username', AdminController.getAccountDownline);

// Product Route
router.post('/product/without-size', AdminController.createProductWithoutSize);
router.post('/product/with-size', AdminController.createProductWithSize);
router.post('/product/create-size', AdminController.createSize);
router.get('/product', AdminController.getProduct);
router.get('/product/detail/:slug', AdminController.getProductDetail);
router.patch('/product/edit/:productId', AdminController.editProduct);
router.delete('/product/delete/:productId', AdminController.deleteProduct);
router.patch('/product/status/:productId', AdminController.productActiveStatus);

router.patch('/product/size/edit/:sizeId', AdminController.editSize);

// Image Controller
router
    .route('/image/upload')
    .post(
        multer({ dest: 'temp/product' }).single('image'),
        AdminController.uploadImage
    );

// Category Controller
router.post('/category', AdminController.createCategory);
router.get('/category', AdminController.getCategory);
router.get('/category/delete/:categoryId', AdminController.deleteCategory);
router.get('/category/product/:categoryId', AdminController.createCategory);
router.patch('/category/edit/:categoryId', AdminController.editCategory);

// Catalog Controller
router
    .route('/catalog')
    .post(
        multer({ dest: 'temp/catalog' }).single('image'),
        AdminController.createCatalog
    );
router.get('/catalog', AdminController.getCatalog);
router.get('/catalog/delete/:catalogId', AdminController.deleteCatalog);
router.get('/catalog/product/:catalogId', AdminController.createCategory);
router.patch('/catalog/edit/:catalogId', AdminController.createCategory);

// Banner Controller
router
    .route('/banner')
    .post(
        multer({ dest: 'temp/banner' }).single('image'),
        AdminController.uploadBanner
    );
router.get('/banner', AdminController.getBanner);

router.post('/order/', AdminController.createOrder);
router.get('/order/', AdminController.getOrderData);
router.get('/order/:orderId', AdminController.getOrder);
router.patch('/update-status/:orderId', AdminController.updateOrderStatus);

// router.post('/referral/', AdminController.createOrder);

router.post('/faq', AdminController.createFaq);
router.get('/faq', AdminController.getFaq);

const adminRoutes = router;

module.exports = adminRoutes;
