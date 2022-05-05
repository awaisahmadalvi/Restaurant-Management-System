const express = require('express');
const router = express.Router();
const table_db = require('../model/tables-model');

router.get('/', async (req, res) => {
    try {
        const tabels = await table_db.find();
        res.json(tabels);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', async (req, res) => {
    const table = new table_db({
        id: req.body.id,
        order_id: req.body.order_id,
    });
    try {
        const newTable = await table.save();
        res.status(201).json(newTable);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;