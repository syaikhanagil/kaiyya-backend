const mongoose = require('mongoose');

const Catalog = mongoose.model('Catalog');
const Product = mongoose.model('Product');

const getCatalog = async (request, response) => {
    Catalog.find().sort('name').then((catalog) => {
        const data = [];
        for (let i = 0; i < catalog.length; i++) {
            const obj = {
                id: catalog[i].id,
                name: catalog[i].name,
                slug: catalog[i].slug,
                banner: catalog[i].banner,
                products: catalog[i].products
            };
            data.push(obj);
        }
        return response.status(200).json({
            status: true,
            message: 'successfully get catalog data',
            data
        });
    });
};

const getCatalogDetail = async (request, response) => {
    const { slug } = request.params;
    Catalog.findOne({
        slug
    }).then((catalog) => {
        Product.find({
            catalog: catalog.id,
            is_active: true
        }).populate('sizes').then((product) => {
            const products = [];
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
                    is_active: product[i].is_active ? 'AKTIF' : 'TIDAK AKTIF',
                    createdAt: product[i].createdAt,
                    updatedAt: product[i].updatedAt
                };
                products.push(obj);
            }
            const data = {
                id: catalog.id,
                name: catalog.name,
                banner: catalog.banner,
                products
            };
            return response.status(200).json({
                status: true,
                message: 'successfully get catalog data',
                data
            });
        });
    });
};

const CatalogController = {
    getCatalog,
    getCatalogDetail
};

module.exports = CatalogController;
