const router = require('express').Router();
const multer = require('multer');
const ImageController = require('../../controllers/Image');

router
    .route('/')
    .post(
        multer({ dest: 'temp/product' }).single('image'),
        ImageController.uploadImage
    );
router.get('/product/:productId', ImageController.getImages);
router.get('/:imageId', ImageController.getImage);

const imageRoutes = router;

module.exports = imageRoutes;
