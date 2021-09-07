const mongoose = require('mongoose');

const { Schema } = mongoose;

const ImageSchema = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    },
    src: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Image', ImageSchema);
