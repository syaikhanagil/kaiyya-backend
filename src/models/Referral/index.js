const mongoose = require('mongoose');

const { Schema } = mongoose;

const ReferralSchema = new Schema({
    account: {
        type: Schema.Types.ObjectId,
        ref: 'Account'
    },
    referral_account: {
        type: Schema.Types.ObjectId,
        ref: 'Account'
    },
    amount: {
        type: Number,
        required: true,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model('Referral', ReferralSchema);
