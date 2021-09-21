const router = require('express').Router();
const ImageController = require('../../controllers/Image');

router.get('/product/:productId', ImageController.getImages);
router.get('/:imageId', ImageController.getImage);

const imageRoutes = router;

module.exports = imageRoutes;
