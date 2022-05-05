const express = require('express');
const router = express.Router();
const orderlist_db = require('../model/orderlist-model');

router.get('/', async (req, res) => {
    try {
        const orders = await orderlist_db.find();
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', async (req, res) => {
    const order = new orderlist_db({
        order_id: req.body.id,
        rate_id: req.body.rate_id,
        rate: req.body.table_id,
    });
    try {
        const newOrder = await order.save();
        res.status(201).json(newOrder);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;