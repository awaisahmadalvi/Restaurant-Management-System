const mongoose = require('mongoose');

const dishesSchema = new mongoose.Schema({
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
        default: false
    },
    create_date: {
        type: Date,
        required: true,
        default: Date.now
    },
});

module.exports = mongoose.model('Dishes', dishesSchema);