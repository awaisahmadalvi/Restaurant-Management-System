const express = require('express');
const router = express.Router();
const dish_db = require('../model/dishes-model');
const image_db = require('../model/images-model');


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
router.delete('/:id', getDishDelete, async (req, res) => {
    try {
        // dish = await dish_db.deleteOne({ _id: req.params.id })
        // if (res.dish == null) {
        //     return res.status(404).json({ message: 'Cant find Dish' })
        // }
        res.json({ message: 'Deleted this Dish and associated items' })
    } catch (err) {
        res.status(500).json({ message: err.message })
        console.log(err.message);
    }
})



// Middleware function for gettig dish object by ID
async function getDish(req, res, next) {
    try {
        dish = await dish_db.findById(req.params.id)
        if (dish == null) {
            return res.status(404).json({ message: 'Cant find Dish' })
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }

    res.dish = dish;
    next()
}

// *******************************************
// Dish logic function, association with Genre id
// *******************************************

// Get all images related to a genre id
router.get('/genreid/:id', async (req, res) => {
    try {
        const dishes = await dish_db.find({ genre_id: req.params.id });
        res.json(dishes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Middleware function for deleting Genre its associated dishes and images object by ID
async function getDishDelete(req, res, next) {
    dishes = [];
    images = [];

    // Finding and deleting Dish from req
    try {
        dishes = await dish_db.findOneAndDelete({ _id: req.params.id }, { "_id": 1 });
        if (dishes == null) {
            console.log({ message: 'Cant find Dish' });
            return res.status(404).json({ message: 'Cant find Dish' })
        }
    } catch (err) {
        console.log({ DISHES_ERRORMSG: err.message });
        return res.status(500).json({ message: err.message })
    }
    // casting object with _id to ids array of string
    dishesID = dishes._id.toString();
    // dishesID = dishes.map(d => d._id);
    // console.log("Dishes IDs: ", dishesID);


    // Finding and deleting Images assiciated with deleted dishes & genre from req
    try {
        image = await image_db.find({ dish_id: dishesID }, { "_id": 1 });
        result = await image_db.deleteMany({ dish_id: dishesID }, { "_id": 1 });
        if (image == null) {
            console.log({ message: 'Cant find Image' });
            return res.status(404).json({ message: 'Cant find Image' })
        }
    } catch (err) {
        console.log({ IMAGE_ERRORMSG: err.message });
        return res.status(500).json({ message: err.message })
    }
    // res.images = image;
    // ImageID = image.map(d => d._id);
    // console.log("Image IDs: ", ImageID);

    next();
}

module.exports = router;