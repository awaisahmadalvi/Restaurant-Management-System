const { ObjectId } = require('bson');
const mongoose = require('mongoose');

const orderlistSchema = new mongoose.Schema({
    orderdetail_id: {
        type: ObjectId,
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
}, { timestamps: true });

module.exports = mongoose.model('OrderList', orderlistSchema);