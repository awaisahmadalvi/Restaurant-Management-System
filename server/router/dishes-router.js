const express = require('express');
const router = express.Router();
const dish_db = require('../model/dishes-model');

// Getting all Dishes
router.get('/', async (req, res) => {
    try {
        const dishes = await dish_db.find();
        res.json(dishes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Creating a Dish
router.post('/', async (req, res) => {
    const dish = new dish_db({
        name: req.body.name,
        genre_id: req.body.genre_id,
        desc: req.body.desc,
        is_active: req.body.is_active,
    });
    try {
        const newdish = await dish.save();
        res.status(201).json(newdish);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Getting one Dish
router.get('/:id', getDish, (req, res) => {
    res.json(res.dish)
});

// Updating one Dish
router.patch('/:id', getDish, async (req, res) => {
    if (req.body.name != null) {
        res.dish.name = req.body.name
    }
    if (req.body.genre_id != null) {
        res.dish.genre_id = req.body.genre_id
    }
    if (req.body.desc != null) {
        res.dish.desc = req.body.desc
    }
    if (req.body.is_active != null) {
        res.dish.is_active = req.body.is_active
    }

    try {
        const updatedDish = await res.dish.save()
        res.json(updatedDish)
    } catch {
        res.status(400).json({ message: err.message })
    }

})

// Deleting one Dish
router.delete('/:id', getDish, async (req, res) => {
    try {
        await res.dish.remove()
        res.json({ message: 'Deleted This Genre' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})



// Middleware function for gettig dish object by ID
async function getDish(req, res, next) {
    try {
        dish = await dish_db.findById(req.params.id)
        if (dish == null) {
            return res.status(404).json({ message: 'Cant find subscriber' })
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }

    res.dish = dish;
    next()
}

module.exports = router;