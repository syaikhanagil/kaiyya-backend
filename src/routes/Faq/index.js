const router = require('express').Router();
const FaqController = require('../../controllers/Faq');

router.get('/', FaqController.getFaq);

const categoryRoutes = router;

module.exports = categoryRoutes;
