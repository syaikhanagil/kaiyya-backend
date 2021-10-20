const router = require('express').Router();
const RulesController = require('../../controllers/Rules');

router.get('/', RulesController.getRules);

const rulesRoutes = router;

module.exports = rulesRoutes;
