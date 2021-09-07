const router = require('express').Router();
const multer = require('multer');
const CatalogController = require('../../controllers/Catalog');

router
    .route('/')
    .post(
        multer({ dest: 'temp/catalog' }).single('image-upload'),
        CatalogController.createCatalog
    );

const catalogRoutes = router;

module.exports = catalogRoutes;
