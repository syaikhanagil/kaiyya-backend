const mongoose = require('mongoose');

const Catalog = mongoose.model('Catalog');

const getCatalog = async (request, response) => {
    Catalog.find().then((catalog) => {
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
    Catalog.find({
        slug
    }).then((catalog) => {
        const data = [];
        for (let i = 0; i < catalog.length; i++) {
            const obj = {
                id: catalog[i].id,
                name: catalog[i].name,
                src: catalog[i].banner
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

const CatalogController = {
    getCatalog,
    getCatalogDetail
};

module.exports = CatalogController;
