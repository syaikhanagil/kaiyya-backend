const mongoose = require('mongoose');

const Notification = mongoose.model('Notification');

const getPrivateNotification = (request, response) => {
    const { uid } = request.session;
    Notification.find({
        account: uid
    }).then((notification) => {
        const data = [];
        for (let i = 0; i < notification.length; i++) {
            const obj = {
                id: notification[i].id,
                title: notification[i].title,
                message: notification[i].message,
                status: notification[i].status
            };
            data.push(obj);
        }
        return response.status(200).json({
            status: true,
            message: 'successfully get notification data',
            data
        });
    });
};

const getPublicNotification = (request, response) => {
    Notification.find().then((notification) => {
        const data = [];
        for (let i = 0; i < notification.length; i++) {
            const obj = {
                id: notification[i].id,
                title: notification[i].title,
                message: notification[i].message,
                status: notification[i].status
            };
            data.push(obj);
        }
        return response.status(200).json({
            status: true,
            message: 'successfully get notification data',
            data: notification
        });
    });
};

const getNotificationDetail = (request, response) => {
    const { notificationId } = request.params;
    Notification.findOne({
        _id: notificationId
    }).then((notification) => {
        return response.status(200).json({
            status: true,
            message: 'successfully get notification data',
            data: {
                id: notification.id,
                title: notification.title,
                message: notification.message,
                status: notification.status
            }
        });
    });
};

const NotificationController = {
    getPrivateNotification,
    getPublicNotification,
    getNotificationDetail
};

module.exports = NotificationController;
