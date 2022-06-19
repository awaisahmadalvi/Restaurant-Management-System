const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const tablesSchema = new mongoose.Schema({
    number: {
        type: String,
        required: true,
        unique: true,
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

tablesSchema.plugin(uniqueValidator)
module.exports = mongoose.model('Tables', tablesSchema);