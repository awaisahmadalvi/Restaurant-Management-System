const mongoose = require('mongoose');

const tablesSchema = new mongoose.Schema({
    number: {
        type: String,
        required: true
    },
    order_id: {
        type: String,
        required: true
    },
    create_date: {
        type: Date,
        required: true,
        default: Date.now
    },
});

module.exports = mongoose.model('Tables', tablesSchema);