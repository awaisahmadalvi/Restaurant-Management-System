const express = require('express');
const router = express.Router();
const dish_db = require('../model/dishes-model');

router.get('/', async (req, res) => {
    try {
        const dishes = await dish_db.find();
        res.json(dishes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', async (req, res) => {
    const dish = new dish_db({
        id: req.body.id,
        name: req.body.name,
        genre_id: req.body.genre_id,
        desc: req.body.desc,
    });
    try {
        const newdish = await dish.save();
        res.status(201).json(newdish);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;