const mongoose = require('mongoose');

const { Schema } = mongoose;

const DisbursementSchema = new Schema({
    account: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    },
    external_id: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        default: 10000
    },
    bank_name_holder: {
        type: String,
        required: true
    },
    bank_code: {
        type: String,
        required: true,
        uppercase: true
    },
    bank_number: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Disbursement', DisbursementSchema);
