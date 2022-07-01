const { ObjectId } = require('bson');
const mongoose = require('mongoose');

const ratelistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    dish_id: {
        type: ObjectId,
        required: true
    },
    is_active: {
        type: Boolean,
        required: true
    },
}, { timestamps: true });

module.exports = mongoose.model('RateList', ratelistSchema);