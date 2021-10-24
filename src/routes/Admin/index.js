const router = require('express').Router();
const multer = require('multer');
const AdminController = require('../../controllers/Admin');

router.post('/login', AdminController.login);

// Account Route
router.get('/account', AdminController.getAccounts);
router.get('/account/:userRole', AdminController.getAccountByRole);
router.get('/account/downline/:username', AdminController.getAccountDownline);
router.post('/account/create-account', AdminController.createNewAccount);

// Product Route
router.post('/product/without-size', AdminController.createProductWithoutSize);
router.post('/product/with-size', AdminController.createProductWithSize);
router.get('/product', AdminController.getProduct);
router.get('/product/detail/:slug', AdminController.getProductDetail);
router.patch('/product/edit/:productId', AdminController.editProduct);
router.delete('/product/delete/:productId', AdminController.deleteProduct);
router.patch('/product/type/:productId', AdminController.productType);
router.patch('/product/status/:productId', AdminController.productActiveStatus);

router.patch('/product/size/create/:productId', AdminController.createSize);
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
router.patch('/banner/status/:bannerId', AdminController.bannerActiveStatus);
router.post('/banner/delete/:bannerId', AdminController.deleteBanner);

router.post('/order/', AdminController.createOrder);
router.get('/order/', AdminController.getOrder);
router.get('/order/detail/:orderId', AdminController.getOrderDetail);
router.patch('/order/cancel/:orderId', AdminController.cancelOrder);
router.post('/order/confirm/:orderId', AdminController.confirmOrder);
router.post('/order/add-resi/:orderId', AdminController.addOrderResi);

router.get('/disbursement/', AdminController.getDisbursement);
router.get('/disbursement/:disbursementId', AdminController.approveDisbursement);

// Faq Controller
router.post('/faq', AdminController.createFaq);
router.get('/faq', AdminController.getFaq);
router.patch('/faq/edit/:faqId', AdminController.editFaq);
router.post('/faq/delete/:faqId', AdminController.deleteFaq);

// Rules Controller
router.post('/rules', AdminController.createRules);
router.get('/rules', AdminController.getRules);
router.patch('/rules/edit/:rulesId', AdminController.editRules);
router.post('/rules/delete/:rulesId', AdminController.deleteRules);

// Post Controller
router
    .route('/post')
    .post(
        multer({ dest: 'temp/post' }).single('image'),
        AdminController.createPost
    );
router.get('/post', AdminController.getPost);
router.get('/post/detail/:postId', AdminController.getPostDetail);
router.patch('/post/edit/:postId', AdminController.editPost);

const adminRoutes = router;

module.exports = adminRoutes;
