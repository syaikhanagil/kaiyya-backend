const router = require('express').Router();
const CatalogController = require('../../controllers/Catalog');

router.get('/', CatalogController.getCatalog);
router.get('/detail/:slug', CatalogController.getCatalogDetail);

const catalogRoutes = router;

module.exports = catalogRoutes;
