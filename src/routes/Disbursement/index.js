const router = require('express').Router();
const DisbursementController = require('../../controllers/Disbursement');

router.post('/', DisbursementController.createDisbursement);
router.get('/', DisbursementController.getDisbursement);
router.get('/detail/:disbirsementId', DisbursementController.getDisbursementDetail);
router.post('/callback/xendit', DisbursementController.callbackDisbursement);

const disbursementRoutes = router;

module.exports = disbursementRoutes;
