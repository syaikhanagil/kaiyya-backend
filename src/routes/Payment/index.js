const router = require('express').Router();
const PaymentController = require('../../controllers/Payment');

router.get('/:paymentId', PaymentController.getPayment);
router.post('/virtual-account', PaymentController.createVirtualAccount);
router.post('/qris', PaymentController.createQris);

router.get('/available/virtual-account', PaymentController.checkAvailableVirtualAccount);

router.post('/callback/xendit/virtual-account/paid', PaymentController.callbackVirtualAccountPaid);
router.post('/callback/xendit/virtual-account/update', PaymentController.callbackVirtualAccountUpdate);
router.get('/test/vx/:externalId', PaymentController.testVirtualAccountPay);

router.post('/callback/xendit/qris/paid', PaymentController.callbackQrisPaid);

const paymentRoutes = router;

module.exports = paymentRoutes;
