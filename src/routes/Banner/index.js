const router = require('express').Router();
const multer = require('multer');
const BannerController = require('../../controllers/Banner');

// upload banner
router
    .route('/')
    .post(
        multer({ dest: 'temp/banner' }).single('banner'),
        BannerController.uploadBanner
    );

router.get('/', BannerController.getBanner);
router.delete('/:id', BannerController.deleteBanner);

const bannerRoutes = router;
module.exports = bannerRoutes;
