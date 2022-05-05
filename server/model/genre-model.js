const mongoose = require('mongoose');

const genreSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    is_active: {
        type: Boolean,
        required: true
    },
});

module.exports = mongoose.model('Genre', genreSchema);