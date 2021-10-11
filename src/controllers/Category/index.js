const mongoose = require('mongoose');

const Category = mongoose.model('Category');
const Product = mongoose.model('Product');

const getCategory = async (request, response) => {
    Category.find().sort({ name: 1 }).then((category) => {
        const data = [];
        for (let i = 0; i < category.length; i++) {
            const obj = {
                id: category[i].id,
                name: category[i].name,
                slug: category[i].slug
            };
            data.push(obj);
        }
        return response.status(200).json({
            status: true,
            message: 'successfully get category data',
            data
        });
    });
};

const getCategoryDetail = async (request, response) => {
    const { slug } = request.params;
    Category.findOne({
        slug
    }).then((category) => {
        Product.find({
            category: category.id,
            is_active: true
        }).populate('sizes images').sort({ createdAt: -1 }).then((product) => {
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
                message: 'successfully get category data',
                data
            });
        });
    });
};

const CategoryController = {
    getCategory,
    getCategoryDetail
};

module.exports = CategoryController;
