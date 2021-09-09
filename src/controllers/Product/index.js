const mongoose = require('mongoose');

const Product = mongoose.model('Product');
const Size = mongoose.model('Size');
const Image = mongoose.model('Image');

const createProduct = async (request, response) => {
    const { name, detail, catalog, category, stock, sizes } = request.body;
    if (!name) {
        return response.status(400).json({
            status: false,
            message: 'name is required'
        });
    }
    if (!detail) {
        return response.status(400).json({
            status: false,
            message: 'detail is required'
        });
    }
    let totalStock = 0;
    if (sizes) {
        for (let i = 0; i < sizes.length; i++) {
            totalStock += sizes[i].stock;
        }
    }
    const slug = name.split(' ').join('-');
    const newProduct = new Product({
        name,
        slug,
        catalog,
        category,
        detail,
        stock: sizes ? totalStock : stock
    });
    newProduct.save((err, product) => {
        if (err) {
            return response.status(400).json({
                status: false,
                message: 'create new product failed'
            });
        }
        if (sizes) {
            const sizeIds = []; // array kosong untuk menampung _id yang akan disimpan
            for (let i = 0; i < sizes.length; i++) {
                const newSize = new Size({
                    product: product.id,
                    name: sizes[i].name,
                    price: sizes[i].price,
                    stock: sizes[i].stock
                });
                newSize.save((err2, size) => {
                    if (err2) {
                        return response.status(400).json({
                            status: false,
                            message: 'create new product failed'
                        });
                    }
                    sizeIds.push(size.id);
                    if (sizeIds.length === sizes.length) {
                        product.sizes = sizeIds;
                        product.save();
                    }
                });
            }
        }
        return response.status(200).json({
            status: true,
            message: 'new product created successfully',
            data: product
        });
    });
};

const getProduct = async (request, response) => {
    await Product.find({
        is_active: true
    })
        .populate('sizes images')
        .then((product) => {
            const data = [];
            for (let i = 0; i < product.length; i++) {
                const obj = {
                    id: product[i].id,
                    name: product[i].name,
                    slug: product[i].slug,
                    stock: product[i].stock,
                    sizes: product[i].sizes,
                    images: product[i].images
                };
                data.push(obj);
            }
            return response.status(200).json({
                status: true,
                data
            });
        })
        .catch(() => {
            return response.status(400).json({
                status: false,
                message: "can't fetch product data"
            });
        });
};

const getProductDetail = async (request, response) => {
    const { slug } = request.params;
    await Product.findOne({
        slug
    }).populate('images sizes')
        .then(async (product) => {
            const images = [];
            const sizes = [];
            for (let i = 0; i < product.images.length; i++) {
                const obj = {
                    id: product.images[i].id,
                    name: product.images[i].name,
                    src: product.images[i].src
                };
                images.push(obj);
            }
            for (let i = 0; i < product.sizes.length; i++) {
                const obj = {
                    id: product.sizes[i].id,
                    name: product.sizes[i].name,
                    price: product.sizes[i].price,
                    stock: product.sizes[i].stock
                };
                sizes.push(obj);
            }
            return response.status(200).json({
                status: true,
                data: {
                    id: product.id,
                    name: product.name,
                    slug: product.slug,
                    detail: product.detail,
                    stock: product.stock,
                    sizes,
                    images
                }
            });
        })
        .catch(() => {
            return response.status(400).json({
                status: false,
                message: "can't fetch product data"
            });
        });
};

// const editProduct = async (request, response) => {
//     const { productId } = request.params;
//     const { name, detail, isActive } = request.body;
//     Product.findOne({
//         _id: productId
//     });
// };

const deleteProduct = (request, response) => {
    const { productId } = request.params;
    Product.deleteOne({
        _id: productId
    }).then((product) => {
        Size.deleteMany({
            product: productId
        });
        Image.deleteMany({
            product: productId
        });
        return response.status(200).json({
            status: true,
            message: 'product successfully delete',
            data: product
        });
    }).catch(() => {
        return response.status(400).json({
            status: false,
            message: 'product can\'t deleted'
        });
    });
};

const ProductController = {
    createProduct,
    getProduct,
    getProductDetail,
    deleteProduct
    // editProduct
};

module.exports = ProductController;
