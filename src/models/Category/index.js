const mongoose = require('mongoose');

const { Schema } = mongoose;
const CategorySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        lowercase: true
    },
    products: [{
        type: Schema.Types.ObjectId,
        ref: 'Product'
    }]
});

module.exports = mongoose.model('Category', CategorySchema);
