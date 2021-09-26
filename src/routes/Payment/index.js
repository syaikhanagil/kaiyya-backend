const router = require('express').Router();
const PaymentController = require('../../controllers/Payment');

router.get('/:paymentId', PaymentController.getPayment);
router.post('/virtual-account', PaymentController.createVirtualAccount);
router.post('/qris', PaymentController.createQris);

// d2eece68d33d2026a20529f0f43169c3488858d04e65bed393b8bb573e1c3d6e
router.post('/callback/xendit/virtual-account/paid', PaymentController.callbackVirtualAccountPaid);
router.post('/callback/xendit/virtual-account/update', PaymentController.callbackVirtualAccountUpdate);

router.post('/callback/xendit/qris/paid', PaymentController.callbackQrisPaid);

const paymentRoutes = router;

module.exports = paymentRoutes;
