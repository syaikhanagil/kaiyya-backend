const mongoose = require('mongoose');

const { Schema } = mongoose;

const NotificationSchema = new Schema({
    account: {
        type: Schema.Types.ObjectId,
        ref: 'Account'
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'unread',
        required: true
    },
    channel: {
        type: String,
        required: true,
        default: 'other'
    },
    group: {
        type: String,
        required: false,
        default: ''
    }
}, { timestamps: true });

module.exports = mongoose.model('Notification', NotificationSchema);
