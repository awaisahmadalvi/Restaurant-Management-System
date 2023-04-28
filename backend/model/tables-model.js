const { ObjectId, NilObjectID } = require('bson');
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const tablesSchema = new mongoose.Schema({
    number: {
        type: String,
        required: true,
        unique: true,
    },
    order_id: {
        // type: mongoose.Schema.Types.Mixed,
        type: [ObjectId | String],
        required: true,
        default: "-1",
    },
}, { timestamps: true });

tablesSchema.plugin(uniqueValidator)
module.exports = mongoose.model('Tables', tablesSchema);