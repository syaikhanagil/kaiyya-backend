const mongoose = require('mongoose');

const Product = mongoose.model('Product');

const getFeaturedProduct = async (request, response) => {
    await Product.find({
        type: 'ready-stock',
        is_active: true
    })
        .where('stock').gt('8')
        .limit(4)
        .populate('sizes images category')
        .sort({ createdAt: -1 })
        .then((product) => {
            const data = [];
            for (let i = 0; i < product.length; i++) {
                const obj = {
                    id: product[i].id,
                    name: product[i].name,
                    slug: product[i].slug,
                    stock: product[i].stock,
                    sizes: product[i].sizes,
                    images: product[i].images,
                    category: product[i].category,
                    weight: product[i].weight,
                    type: product[i].type,
                    is_active: product[i].is_active ? 'AKTIF' : 'TIDAK AKTIF',
                    createdAt: product[i].createdAt,
                    updatedAt: product[i].updatedAt
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

const getProduct = async (request, response) => {
    const { type } = request.params;
    await Product.find({
        type: type || 'ready-stock',
        is_active: true
    })
        .populate('sizes images category')
        .sort({ createdAt: -1 })
        .then((product) => {
            const data = [];
            for (let i = 0; i < product.length; i++) {
                const obj = {
                    id: product[i].id,
                    name: product[i].name,
                    slug: product[i].slug,
                    stock: product[i].stock,
                    sizes: product[i].sizes,
                    images: product[i].images,
                    category: product[i].category,
                    weight: product[i].weight,
                    type: product[i].type,
                    is_active: product[i].is_active ? 'AKTIF' : 'TIDAK AKTIF',
                    createdAt: product[i].createdAt,
                    updatedAt: product[i].updatedAt
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
        slug,
        is_active: true
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
                    stock: product.sizes[i].stock,
                    chart: product.sizes[i].chart
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
                    is_active: product.is_active,
                    category: product.category,
                    type: product.type,
                    form_link: product.form_link,
                    sizes,
                    images,
                    weight: product.weight
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

const ProductController = {
    getProduct,
    getFeaturedProduct,
    getProductDetail
};

module.exports = ProductController;
