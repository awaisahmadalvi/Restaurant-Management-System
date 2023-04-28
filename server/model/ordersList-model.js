const { ObjectId } = require('bson');
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

mongoose.Promise = global.Promise;

const orderListSchema = new mongoose.Schema({
    daily_number: {
        type: String,
        required: true,
    },
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
        type: Number,
        required: true,
        default: 0
    },
    status: {
        type: String,
        required: true,
        default: "Started"
    },
}, { timestamps: true });

orderListSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('OrdersList', orderListSchema);