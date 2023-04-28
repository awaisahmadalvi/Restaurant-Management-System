const mongoose = require('mongoose');

const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    is_active: {
        type: Boolean,
        default: false
    },
}, { timestamps: true });

module.exports = mongoose.model('Genre', genreSchema);