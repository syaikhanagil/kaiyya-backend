const mongoose = require('mongoose');
const { uploadSingle } = require('../../configs/Multer');

const Catalog = mongoose.model('Catalog');

const createCatalog = async (request, response) => {
    const { name } = request.body;
    const slug = name.split(' ').join('-');
    await uploadSingle(request, response, 'catalog').then((banner) => {
        const newCatalog = new Catalog({
            name,
            slug,
            banner: {
                name: banner.fileName,
                src: banner.url
            }
        });
        newCatalog.save((err, catalog) => {
            if (err) {
                return response.status(400).json({
                    status: false,
                    message: 'failed to create new catalog'
                });
            }
            return response.status(200).json({
                status: true,
                message: 'new catalog created successfully',
                data: catalog
            });
        });
    }).catch(() => {
        return response.status(400).json({
            status: false,
            message: 'failed to upload catalog banner'
        });
    });
};

const getCatalog = async (request, response) => {
    Catalog.find().then((catalog) => {
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

const deleteCatalog = async (request, response) => {
    const { catalogId } = request.params;
    Catalog.deleteOne({
        _id: catalogId
    }).then((catalog) => {
        return response.status(200).json({
            status: true,
            message: 'successfully delete category',
            data: catalog
        });
    });
};

const CatalogController = {
    createCatalog,
    getCatalog,
    deleteCatalog
};

module.exports = CatalogController;
