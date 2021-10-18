const router = require('express').Router();
const NotificationController = require('../../controllers/Notification');

router.get('/', NotificationController.getPrivateNotification);
router.get('/detail/:notificationId', NotificationController.getNotificationDetail);

const notificationRoutes = router;

module.exports = notificationRoutes;
