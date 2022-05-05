const express = require('express');
const router = express.Router();
const orderdetail_db = require('../model/orderdetail-model');

router.get('/', async (req, res) => {
    try {
        const orders = await orderdetail_db.find();
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', async (req, res) => {
    const order = new orderdetail_db({
        id: req.body.id,
        table_id: req.body.table_id,
        datetime: req.body.datetime,
        is_paid: req.body.is_paid,
        total_bill: req.body.total_bill,
        status: req.body.status,
    });
    try {
        const newOrder = await order.save();
        res.status(201).json(newOrder);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;