const mongoose = require('mongoose');

const { Schema } = mongoose;

const PromoSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true,
        lowercase: true
    },
    message: {
        type: String,
        required: true
    }
});

module.exports = PromoSchema;
