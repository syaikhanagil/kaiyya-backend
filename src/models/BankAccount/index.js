const mongoose = require('mongoose');

const { Schema } = mongoose;

const BankAccountSchema = new Schema({
    account: {
        type: Schema.Types.ObjectId,
        ref: 'Account'
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
        required: true,
        unique: true
    }
});

module.exports = mongoose.model('BankAccount', BankAccountSchema);
