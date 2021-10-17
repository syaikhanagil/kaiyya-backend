const mongoose = require('mongoose');

const { Schema } = mongoose;

const OrderDetailSchema = new Schema({
    order: {
        type: Schema.Types.ObjectId,
        ref: 'Order'
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    },
    qty: {
        type: Number,
        required: true,
        default: 1
    },
    size: {
        type: Schema.Types.ObjectId,
        ref: 'Size'
    },
    price: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('OrderDetail', OrderDetailSchema);
