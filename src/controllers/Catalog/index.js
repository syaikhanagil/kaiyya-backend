const mongoose = require('mongoose');
const upload = require('../../configs/Multer');

const Catalog = mongoose.model('Catalog');

const createCatalog = async (request, response) => {
    const { name } = request.body;
    const slug = name.split(' ').join('-');
    await upload(request, response, 'catalog').then((banner) => {
        const newCatalog = new Catalog({
            name,
            slug,
            banner
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

const CatalogController = {
    createCatalog
};

module.exports = CatalogController;
