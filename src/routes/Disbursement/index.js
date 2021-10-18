const router = require('express').Router();
const DisbursementController = require('../../controllers/Dibursement');

router.post('/', DisbursementController.createDisbursement);
router.get('/', DisbursementController.getDisbursement);
router.get('/detail/:disbirsementId', DisbursementController.getDisbursementDetail);

const disbursementRoutes = router;

module.exports = disbursementRoutes;
