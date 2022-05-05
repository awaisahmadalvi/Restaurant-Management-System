const mongoose = require('mongoose');

const imagesSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    dish_id: {
        type: String,
        required: true
    },
    image_data: {
        type: String,
        required: true
    },
});

module.exports = mongoose.model('Images', imagesSchema);