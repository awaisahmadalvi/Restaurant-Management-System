const { ObjectId } = require('bson');
const mongoose = require('mongoose');

const imagesSchema = new mongoose.Schema({
    dish_id: {
        type: ObjectId,
        required: true
    },
    image_data: {
        type: String,
        required: true
    },
}, { timestamps: true });

module.exports = mongoose.model('Images', imagesSchema);