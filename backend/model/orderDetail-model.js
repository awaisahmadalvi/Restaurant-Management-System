const { ObjectId } = require('bson');
const mongoose = require('mongoose');

const orderlistSchema = new mongoose.Schema({
    order_id: {
        type: ObjectId,
        required: true
    },
    rate_id: {
        type: ObjectId,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    qty: {
        type: Number,
        required: true
    },
}, { timestamps: true });

module.exports = mongoose.model('OrderDetail', orderlistSchema);