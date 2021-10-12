const mongoose = require('mongoose');

const { Schema } = mongoose;

const AddressSchema = new Schema({
    account: {
        type: Schema.Types.ObjectId,
        ref: 'Account'
    },
    name: {
        type: String,
        requird: true
    },
    phone: {
        type: String,
        requird: true
    },
    province: {
        type: String,
        required: true
    },
    province_id: {
        type: Number,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    city_id: {
        type: Number,
        required: true
    },
    subdistrict: {
        type: String,
        required: true
    },
    subdistrict_id: {
        type: Number,
        required: true
    },
    detail: {
        type: String,
        required: true
    },
    is_default: {
        type: Boolean,
        required: true,
        default: false
    }
});

module.exports = mongoose.model('Address', AddressSchema);
