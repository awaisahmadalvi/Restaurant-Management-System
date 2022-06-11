const mongoose = require('mongoose');

const orderdetailSchema = new mongoose.Schema({
    table_id: {
        type: String,
        required: true
    },
    is_paid: {
        type: Boolean,
        required: true
    },
    total_bill: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    create_date: {
        type: Date,
        required: true,
        default: Date.now
    },
});

module.exports = mongoose.model('OrdersDetail', orderdetailSchema);