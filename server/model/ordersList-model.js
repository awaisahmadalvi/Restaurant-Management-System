const { ObjectId } = require('bson');
const mongoose = require('mongoose');

const orderListSchema = new mongoose.Schema({
    table_id: {
        type: ObjectId,
        required: true
    },
    is_paid: {
        type: String,
        required: true,
        default: "No"
    },
    total_bill: {
        type: String,
        required: true,
        default: "Not Available Yet"
    },
    status: {
        type: String,
        required: true,
        default: "Started"
    },
}, { timestamps: true });

module.exports = mongoose.model('OrdersList', orderListSchema);