const express = require('express');
const router = express.Router();
const image_db = require('../model/images-model');

router.get('/', async (req, res) => {
    try {
        const images = await image_db.find();
        res.json(images);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', async (req, res) => {
    const image = new image_db({
        id: req.body.id,
        dish_id: req.body.dish_id,
        image_data: req.body.image_data,
    });
    try {
        const newImage = await image.save();
        res.status(201).json(newImage);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;