const express = require('express');
const router = express.Router();
const ratelist_db = require('../model/ratelist-model');

// Getting all ratelist
router.get('/', async (req, res) => {
    try {
        const ratelist = await ratelist_db.find();
        res.json(ratelist);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Creating an ratelist
router.post('/', async (req, res) => {
    const ratelist = new ratelist_db({
        name: req.body.name,
        desc: req.body.desc,
        rate: req.body.rate,
        dish_id: req.body.dish_id,
        is_active: req.body.is_active,
    });
    try {
        const newRate = await ratelist.save();
        res.status(201).json(newRate);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Getting one ratelist
router.get('/:id', getRateList, (req, res) => {
    res.json(res.ratelist)
});

// Updating one ratelist
router.patch('/:id', getRateList, async (req, res) => {
    if (req.body.name != null) {
        res.ratelist.name = req.body.name
    }
    if (req.body.desc != null) {
        res.ratelist.desc = req.body.desc
    }
    if (req.body.rate != null) {
        res.ratelist.rate = req.body.rate
    }
    if (req.body.dish_id != null) {
        res.ratelist.dish_id = req.body.dish_id
    }
    if (req.body.is_active != null) {
        res.ratelist.is_active = req.body.is_active
    }

    try {
        const updatedRateList = await res.ratelist.save()
        res.json(updatedRateList)
    } catch {
        res.status(400).json({ message: err.message })
    }

})

// Deleting one ratelist
router.delete('/:id', getRateList, async (req, res) => {
    try {
        await res.ratelist.remove()
        res.json({ message: 'Deleted This ratelist' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})



// Middleware function for gettig ratelist object by ID
async function getRateList(req, res, next) {
    try {
        ratelist = await ratelist_db.findById(req.params.id)
        if (ratelist == null) {
            return res.status(404).json({ message: 'Cant find ratelist' })
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }

    res.ratelist = ratelist;
    next()
}
module.exports = router;