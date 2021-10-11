const mongoose = require('mongoose');

const { Schema } = mongoose;

const ProductSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    detail: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true,
        default: 0
    },
    weight: {
        type: Number,
        required: true,
        default: 100
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    catalog: {
        type: Schema.Types.ObjectId,
        ref: 'Catalog',
        required: true
    },
    sizes: [{
        type: Schema.Types.ObjectId,
        ref: 'Size'
    }],
    images: [{
        type: Schema.Types.ObjectId,
        ref: 'Image'
    }],
    is_active: {
        type: Boolean,
        required: true,
        default: false
    },
    type: {
        type: String,
        required: true,
        default: 'ready-stock'
    },
    form_link: {
        type: String,
        required: false,
        default: 'none'
    }
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
