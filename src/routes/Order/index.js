const router = require('express').Router();
const OrderController = require('../../controllers/Order');

router.post('/', OrderController.createOrder);
router.get('/', OrderController.getOrders);

const orderRoutes = router;

module.exports = orderRoutes;
