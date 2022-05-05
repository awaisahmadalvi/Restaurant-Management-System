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
    create_date: {
        type: Date,
        required: true,
        default: Date.now
    },
});

module.exports = mongoose.model('Rate_List', ratelistSchema);