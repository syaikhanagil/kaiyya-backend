const router = require('express').Router();
const OrderController = require('../../controllers/Order');

router.post('/', OrderController.createOrder);
router.get('/', OrderController.getOrders);
router.get('/:orderId', OrderController.getOrder);

router.patch('/update-status/:orderId', OrderController.updateOrderStatus);

const orderRoutes = router;

module.exports = orderRoutes;
