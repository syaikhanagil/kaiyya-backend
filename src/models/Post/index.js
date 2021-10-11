const mongoose = require('mongoose');

const { Schema } = mongoose;

const PostSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true,
        lowercase: true
    },
    content: {
        type: String,
        required: true
    },
    thumbnail: {
        name: {
            type: String,
            required: true
        },
        src: {
            type: String,
            required: true
        }
    }
});

module.exports = mongoose.model('Post', PostSchema);
