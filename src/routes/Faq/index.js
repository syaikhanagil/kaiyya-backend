const router = require('express').Router();
const FaqController = require('../../controllers/Faq');

router.get('/', FaqController.getFaq);

const faqRoutes = router;

module.exports = faqRoutes;
