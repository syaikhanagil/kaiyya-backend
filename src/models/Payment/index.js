const mongoose = require('mongoose');

const { Schema } = mongoose;

const PaymentSchema = new Schema({
    account: {
        type: Schema.Types.ObjectId,
        ref: 'Account'
    },
    order: {
        type: Schema.Types.ObjectId,
        ref: 'Order'
    },
    external_id: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'unpaid',
        required: true
    },
    detail: {
        method: {
            type: String,
            required: true,
            default: 'virtual-account'
        },
        name: String,
        amount: {
            type: Number,
            required: true
        },
        bank_code: String,
        virtual_account_number: String,
        qris_src: String
    },
    expired: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Payment', PaymentSchema);
