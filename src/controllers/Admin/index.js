const { login, getAccounts, getAccountDownline, getAccountByRole } = require('./account.controller');
const { uploadBanner, getBanner, deleteBanner } = require('./banner.controller');
const { createCatalog, getCatalog, deleteCatalog } = require('./catalog.controller');
const { createCategory, getCategory, editCategory, deleteCategory } = require('./category.controller');
const { uploadImage, getImage, getImages, deleteImage, deleteImages } = require('./image.controller');
const { createOrder, getOrder, getOrders, getOrderData, updateOrderStatus } = require('./order.controller');
const { createProduct, getProduct, getProductDetail, editProduct, deleteProduct } = require('./product.controller');

const AdminController = {
    // account
    login,
    getAccounts,
    getAccountDownline,
    getAccountByRole,

    // banner
    uploadBanner,
    getBanner,
    deleteBanner,

    // catalog
    createCatalog,
    getCatalog,
    deleteCatalog,

    // category
    createCategory,
    getCategory,
    editCategory,
    deleteCategory,

    // order
    createOrder,
    getOrders,
    getOrder,
    getOrderData,
    updateOrderStatus,

    // product
    createProduct,
    getProduct,
    getProductDetail,
    editProduct,
    deleteProduct,

    // image
    uploadImage,
    getImage,
    getImages,
    deleteImage,
    deleteImages
};

module.exports = AdminController;
