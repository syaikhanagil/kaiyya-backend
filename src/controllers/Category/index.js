const mongoose = require('mongoose');

const Category = mongoose.model('Category');

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
    Category.find({
        slug
    }).sort({ name: 1 }).populate('products').then((category) => {
        const data = [];
        for (let i = 0; i < category.length; i++) {
            const obj = {
                id: category[i].id,
                name: category[i].name,
                slug: category[i].slug,
                products: category[i].products
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

const CategoryController = {
    getCategory,
    getCategoryDetail
};

module.exports = CategoryController;
