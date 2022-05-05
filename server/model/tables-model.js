const mongoose = require('mongoose');

const tablesSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    order_id: {
        type: String,
        required: true
    },
});

module.exports = mongoose.model('Tables', tablesSchema);