const { ObjectId } = require('bson');
const mongoose = require('mongoose');

const dishesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    genre_id: {
        type: ObjectId,
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
}, { timestamps: true });

module.exports = mongoose.model('Dishes', dishesSchema);