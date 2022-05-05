const express = require('express');
const router = express.Router();
const ratelist_db = require('../model/ratelist-model');

router.get('/', async (req, res) => {
    try {
        const ratelist = await ratelist_db.find();
        res.json(characters);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', async (req, res) => {
    const ratelist = new ratelist_db({
        id: req.body.id,
        name: req.body.name,
        desc: req.body.desc,
        rate: req.body.rate,
        dish_id: req.body.dish_id,
    });
    try {
        const newRate = await ratelist.save();
        res.status(201).json(newRate);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;