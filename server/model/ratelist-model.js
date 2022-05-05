const mongoose = require('mongoose');

const ratelistSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    rate: {
        type: String,
        required: true
    },
    dish_id: {
        type: String,
        required: true
    },
    is_active: {
        type: Boolean,
        required: true
    },
});

module.exports = mongoose.model('Rate_List', ratelistSchema);