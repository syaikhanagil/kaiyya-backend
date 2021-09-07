const mongoose = require('mongoose');

const { Schema } = mongoose;

const OrderSchema = new Schema({
    account: {
        type: Schema.Types.ObjectId,
        ref: 'Account'
    },
    address: {
        type: Schema.Types.ObjectId,
        ref: 'Address'
    },
    external_id: {
        type: String,
        required: true
    },
    subtotal: {
        type: Number,
        required: true
    },
    courier: {
        name: {
            type: String,
            required: true,
            uppercase: true
        },
        code: {
            type: String,
            required: true,
            lowercase: true
        },
        service: {
            type: String,
            required: true
        },
        cost: {
            type: Number,
            required: true
        }
    },
    status: {
        type: String,
        default: 'unpaid'
    },
    order_detail: {
        type: Schema.Types.ObjectId,
        ref: 'OrderDetail'
    },
    payment: {
        type: Schema.Types.ObjectId,
        ref: 'Payment'
    }
});

module.exports = mongoose.model('Order', OrderSchema);
