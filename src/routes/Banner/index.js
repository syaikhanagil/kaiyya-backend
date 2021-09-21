const router = require('express').Router();
const BannerController = require('../../controllers/Banner');

router.get('/', BannerController.getBanner);

const bannerRoutes = router;
module.exports = bannerRoutes;
