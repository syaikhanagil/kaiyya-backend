const router = require('express').Router();
const PaymentController = require('../../controllers/Payment');

router.get('/:paymentId', PaymentController.getPayment);
router.post('/virtual-account', PaymentController.createVirtualAccount);
router.post('/qris', PaymentController.createQris);
router.post('/callback/xendit/virtual-account/paid', PaymentController.callbackVirtualAccountPaid);
router.post('/callback/xendit/virtual-account/update', PaymentController.callbackVirtualAccountUpdate);

const paymentRoutes = router;

module.exports = paymentRoutes;
