const mongoose = require('mongoose');

const orderdetailSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    table_id: {
        type: String,
        required: true
    },
    datetime: {
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
});

module.exports = mongoose.model('OrdersDetail', orderdetailSchema);