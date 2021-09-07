const router = require('express').Router();
const PaymentController = require('../../controllers/Payment');

router.get('/:paymentId', PaymentController.getPayment);
router.post('/virtual-account', PaymentController.createVirtualAccount);
router.post('/qris', PaymentController.createQris);
router.post('/callback/virtual-account', PaymentController.callbackVirtualAccountPaid);

const paymentRoutes = router;

module.exports = paymentRoutes;
