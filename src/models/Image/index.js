const mongoose = require('mongoose');

const { Schema } = mongoose;

const ImageSchema = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    },
    name: {
        type: String,
        required: true
    },
    src: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Image', ImageSchema);
