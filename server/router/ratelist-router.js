const express = require('express');
const router = express.Router();
const ratelist_db = require('../model/ratelist-model');

// Getting all ratelist
router.get('/', async (req, res) => {
    try {
        const ratelist = await ratelist_db.find();
        console.log("RateList GET: ", ratelist);
        res.json(ratelist);
    } catch (err) {
        console.log("RateList GET Error: ", err.message);
        res.status(500).json({ message: err.message });
    }
});

// Creating an ratelist
router.post('/', async (req, res) => {
    const ratelist = new ratelist_db({
        name: req.body.name,
        desc: req.body.desc,
        price: req.body.price,
        dish_id: req.body.dish_id,
        is_active: req.body.is_active,
    });
    try {
        const newRate = await ratelist.save();
        console.log("RateList POST: ", newRate);
        res.status(201).json(newRate);
    } catch (err) {
        console.log("RateList POST Error: ", err.message);
        res.status(400).json({ message: err.message });
    }
});

// Getting one ratelist
router.get('/:id', getRateList, (req, res) => {
    console.log("RateList GET ID: ", res.ratelist);
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
    if (req.body.price != null) {
        res.ratelist.price = req.body.price
    }
    if (req.body.dish_id != null) {
        res.ratelist.dish_id = req.body.dish_id
    }
    if (req.body.is_active != null) {
        res.ratelist.is_active = req.body.is_active
    }

    try {
        const updatedRateList = await res.ratelist.save()
        console.log("RateList PATCH: ", updatedRateList);
        res.json(updatedRateList)
    } catch {
        console.log("RateList PATCH Error: ", err.message);
        res.status(400).json({ message: err.message })
    }

})

// Deleting one ratelist
router.delete('/:id', getRateList, async (req, res) => {
    try {
        await res.ratelist.remove()
        console.log("RateList DEL: ", 'Deleted This ratelist');
        res.json({ message: 'Deleted This ratelist' })
    } catch (err) {
        console.log("RateList DEL Error: ", err.message);
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


// *******************************************
// Image logic function, association with dish id
// *******************************************

// Get all images related to a dish id
router.get('/dishid/:id', async (req, res) => {
    try {
        const ratelist = await ratelist_db.find({ dish_id: req.params.id });
        console.log("RateList GET DISHID: ", ratelist, { dish_id: req.params.id });

        res.json(ratelist);
    } catch (err) {
        console.log("RateList GET DISHID Error: ", err.message);
        res.status(500).json({ message: err.message });
    }
});


module.exports = router;