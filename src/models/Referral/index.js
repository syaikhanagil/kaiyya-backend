const mongoose = require('mongoose');

const { Schema } = mongoose;

const ReferralSchema = new Schema({
    account: {
        type: Schema.Types.ObjectId,
        ref: 'Account'
    },
    code: {
        type: String,
        required: true,
        lowercase: true
    },
    point: {
        type: Number,
        required: true,
        default: 0
    }
});

module.exports = mongoose.model('Referral', ReferralSchema);
