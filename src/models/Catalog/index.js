const mongoose = require('mongoose');

const { Schema } = mongoose;

const CatalogSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true,
        lowercase: true
    },
    banner: {
        name: {
            type: String,
            required: true
        },
        src: {
            type: String,
            required: true
        }
    },
    products: [{
        type: Schema.Types.ObjectId,
        ref: 'Product'
    }]
});

module.exports = mongoose.model('Catalog', CatalogSchema);
