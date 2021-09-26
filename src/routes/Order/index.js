const router = require('express').Router();
const OrderController = require('../../controllers/Order');

router.post('/', OrderController.createOrder);
router.get('/', OrderController.getOrder);
router.get('/detail/:orderId', OrderController.getOrderDetail);
router.post('/cancel/:orderId', OrderController.cancelOrder);

router.patch('/update-status/:orderId', OrderController.updateOrderStatus);

const orderRoutes = router;

module.exports = orderRoutes;
