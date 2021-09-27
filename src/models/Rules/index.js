const mongoose = require('mongoose');

const { Schema } = mongoose;

const RulesSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Rules', RulesSchema);
