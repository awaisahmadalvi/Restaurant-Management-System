const mongoose = require('mongoose');

const dishesSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    genre_id: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    is_active: {
        type: Boolean,
        required: true
    },
});

module.exports = mongoose.model('Dishes', dishesSchema);