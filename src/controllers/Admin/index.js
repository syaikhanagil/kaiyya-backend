const { login, getAccounts, getAccountDownline, getAccountByRole, createNewAccount } = require('./account.controller');
const { uploadBanner, getBanner, deleteBanner, bannerActiveStatus } = require('./banner.controller');
const { createCatalog, getCatalog, deleteCatalog } = require('./catalog.controller');
const { approveDisbursement, getDisbursement } = require('./disbursement.controller');
const { createCategory, getCategory, editCategory, deleteCategory } = require('./category.controller');
const { createFaq, getFaq, editFaq, deleteFaq } = require('./faq.controller');
const { uploadImage, getImage, getImages, deleteImage, deleteImages } = require('./image.controller');
const { createOrder, getOrder, getOrderDetail, getOrderByUser, cancelOrder, confirmOrder, addOrderResi } = require('./order.controller');
const { createSize, editSize } = require('./size.controller');
const { createPost, editPost, getPost, getPostDetail } = require('./post.controller');
const { createProductWithSize, createProductWithoutSize, getProduct, getProductDetail, editProduct, deleteProduct, productActiveStatus, productType } = require('./product.controller');
const { createRules, getRules, editRules, deleteRules } = require('./rules.controller');

const AdminController = {
    // account
    login,
    getAccounts,
    getAccountDownline,
    getAccountByRole,
    createNewAccount,

    // banner
    uploadBanner,
    getBanner,
    deleteBanner,
    bannerActiveStatus,

    // catalog
    createCatalog,
    getCatalog,
    deleteCatalog,

    // category
    createCategory,
    getCategory,
    editCategory,
    deleteCategory,

    // disbursement
    getDisbursement,
    approveDisbursement,

    // faq
    createFaq,
    getFaq,
    editFaq,
    deleteFaq,

    // rules
    createRules,
    getRules,
    editRules,
    deleteRules,

    // order
    createOrder,
    getOrder,
    getOrderDetail,
    getOrderByUser,
    cancelOrder,
    confirmOrder,
    addOrderResi,

    // product
    createProductWithSize,
    createProductWithoutSize,
    getProduct,
    getProductDetail,
    editProduct,
    deleteProduct,
    productActiveStatus,
    productType,

    // size
    createSize,
    editSize,

    // image
    uploadImage,
    getImage,
    getImages,
    deleteImage,
    deleteImages,

    // post
    createPost,
    getPost,
    getPostDetail,
    editPost
};

module.exports = AdminController;
