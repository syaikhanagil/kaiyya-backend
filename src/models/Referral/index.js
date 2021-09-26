const mongoose = require('mongoose');

const { Schema } = mongoose;

const ReferralSchema = new Schema({
    referral_account: {
        type: Schema.Types.ObjectId,
        ref: 'Account'
    },
    order: {
        type: Schema.Types.ObjectId,
        ref: 'Order'
    },
    referral_code: {
        type: String,
        required: true,
        default: 'none'
    },
    amount: {
        type: Number,
        required: true,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model('Referral', ReferralSchema);
