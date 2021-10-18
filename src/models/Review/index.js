const mongoose = require('mongoose');

const { Schema } = mongoose;

const ReviewSchema = new Schema({
    account: {
        type: Schema.Types.ObjectId,
        ref: 'Account'
    },
    Product: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    },
    comment: {
        type: String,
        required: true
    },
    star: {
        type: Number,
        default: 5,
        required: true
    }
});

module.exports = mongoose.model('Review', ReviewSchema);
