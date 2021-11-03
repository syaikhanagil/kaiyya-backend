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
    resi: {
        type: String,
        default: ''
    },
    discount: {
        type: Number,
        default: 0
    },
    point: {
        type: Number,
        default: 0
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
    notes: {
        type: String,
        required: false,
        default: 'none'
    },
    status: {
        type: String,
        default: 'unpaid'
    },
    shipment: {
        name: {
            type: String,
            requird: false
        },
        phone: {
            type: String,
            requird: false
        },
        province: {
            type: String,
            required: false
        },
        province_id: {
            type: Number,
            required: false
        },
        city: {
            type: String,
            required: false
        },
        city_id: {
            type: Number,
            required: false
        },
        subdistrict: {
            type: String,
            required: false
        },
        subdistrict_id: {
            type: Number,
            required: false
        },
        detail: {
            type: String,
            required: false
        }
    },
    order_detail: [{
        type: Schema.Types.ObjectId,
        ref: 'OrderDetail'
    }],
    payment: {
        type: Schema.Types.ObjectId,
        ref: 'Payment'
    }
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);
