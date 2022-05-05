const express = require('express');
const router = express.Router();
const genre_db = require('../model/genre-model');

// Getting all Genre
router.get('/', async (req, res) => {
    try {
        const genres = await genre_db.find();
        res.json(genres);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Creating a Genre
router.post('/', async (req, res) => {
    const genre = new genre_db({
        name: req.body.name,
        is_active: req.body.is_active,
    });
    try {
        const newGenre = await genre.save();
        res.status(201).json(newGenre);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Getting one Genre
router.get('/:id', getGenre, (req, res) => {
    res.json(res.genre)
});

// Updating one Genre
router.patch('/:id', getGenre, async (req, res) => {
    if (req.body.name != null) {
        res.genre.name = req.body.name
    }

    if (req.body.is_active != null) {
        res.genre.is_active = req.body.is_active
    }

    try {
        const updatedGenre = await res.genre.save()
        res.json(updatedGenre)
    } catch {
        res.status(400).json({ message: err.message })
    }

})

// Deleting one Genre
router.delete('/:id', getGenre, async (req, res) => {
    try {
        await res.genre.remove()
        res.json({ message: 'Deleted This Genre' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})



// Middleware function for gettig subscriber object by ID
async function getGenre(req, res, next) {
    try {
        genre = await genre_db.findById(req.params.id)
        if (genre == null) {
            return res.status(404).json({ message: 'Cant find subscriber' })
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }

    res.genre = genre;
    next()
}

module.exports = router;