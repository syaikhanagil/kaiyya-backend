const mongoose = require('mongoose');

const { Schema } = mongoose;

const FeedbackSchema = new Schema({
    account: {
        type: Schema.Types.ObjectId,
        ref: 'Account'
    },
    comment: {
        type: String,
        required: true
    },
    star: {
        type: Number,
        default: 5,
        required: true
    }
});

module.exports = mongoose.model('Feedback', FeedbackSchema);
