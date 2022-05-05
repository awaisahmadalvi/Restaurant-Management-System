const express = require('express');
const router = express.Router();
const genre_db = require('../model/genre-model');

router.get('/', async (req, res) => {
    try {
        const genres = await genre_db.find();
        res.json(genres);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', async (req, res) => {
    const genre = new genre_db({
        id: req.body.id,
        name: req.body.name,
    });
    try {
        const newGenre = await genre.save();
        res.status(201).json(newGenre);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;