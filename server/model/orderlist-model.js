const mongoose = require('mongoose');

const orderlistSchema = new mongoose.Schema({
    order_id: {
        type: String,
        required: true
    },
    rate_id: {
        type: String,
        required: true
    },
    rate: {
        type: String,
        required: true
    },
});

module.exports = mongoose.model('OrderList', orderlistSchema);