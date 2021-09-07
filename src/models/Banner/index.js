const mongoose = require('mongoose');

const { Schema } = mongoose;

const BannerSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    src: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true,
        default: '/'
    }
});

module.exports = mongoose.model('Banner', BannerSchema);
