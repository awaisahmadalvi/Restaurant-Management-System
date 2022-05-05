const mongoose = require('mongoose');

const imagesSchema = new mongoose.Schema({
    dish_id: {
        type: String,
        required: true
    },
    image_data: {
        type: String,
        required: true
    },
    create_date: {
        type: Date,
        required: true,
        default: Date.now
    },
});

module.exports = mongoose.model('Images', imagesSchema);