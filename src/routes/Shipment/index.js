const router = require('express').Router();
const ShipmentController = require('../../controllers/Shipment');

router.get('/services', ShipmentController.getService);
router.post('/cost', ShipmentController.getCost);
router.post('/detail', ShipmentController.getShipmentDetail);

const shipmentRoutes = router;

module.exports = shipmentRoutes;
