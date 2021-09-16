const mongoose = require('mongoose');

const Category = mongoose.model('Category');

const createCategory = async (request, response) => {
    const { name } = request.body;
    const slug = name.split(' ').join('-');
    const newCategory = new Category({
        name,
        slug
    });
    newCategory.save((err, category) => {
        if (err) {
            return response.status(400).json({
                status: false,
                message: 'failed to create new category'
            });
        }
        return response.status(200).json({
            status: true,
            message: 'new category created',
            data: category
        });
    });
};

const getCategory = async (request, response) => {
    Category.find().sort({ name: 1 }).populate('products').then((category) => {
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
    createCategory,
    getCategory
};

module.exports = CategoryController;
