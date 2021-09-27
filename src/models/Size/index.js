const mongoose = require('mongoose');

const { Schema } = mongoose;

const SizeSchema = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    },
    name: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true,
        default: 0
    },
    price: {
        type: Number,
        required: true
    },
    chart: {
        length: {
            type: Number
        },
        width: {
            type: Number
        }
    }
});

module.exports = mongoose.model('Size', SizeSchema);
