const express = require('express');
const router = express.Router();
const genre_db = require('../model/genre-model');
const dish_db = require('../model/dishes-model');
const image_db = require('../model/images-model');
const ratelist_db = require('../model/ratelist-model');


router.get('/stats', async (req, res) => {
    b = [
        {
            "$match": {
                "is_active": true
            }
        },
        {
            $facet: {
                metadata: [{ $count: "total" }],
            }
        }];

    console.log(b);

    genre_db.aggregate(b)
        .then((data) => {
            console.log("Genre GETSTATS: ", JSON.stringify(data));

            res.send(data);

        })
        .catch((err) => {
            console.log(err);
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving tutorials.",
            });
        });
});

// Getting all Genre
router.get('/', async (req, res) => {
    try {
        const genres = await genre_db.find();
        console.log("Genre GET: ", genres);
        res.json(genres);
    } catch (err) {
        console.error("Genre GET Error: ", err.message);
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
        console.log("Genre POST: ", newGenre);
        res.status(201).json(newGenre);
    } catch (err) {
        console.error("Genre POST Error: ", err.message);
        res.status(400).json({ message: err.message });
    }
});

// Getting one Genre
router.get('/:id', getGenre, (req, res) => {
    console.log("Genre GET ID: ", res.genre);
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
        console.log("Genre PATCH: ", updatedGenre);
        res.json(updatedGenre)
    } catch {
        console.log("Genre PATCH Error: ", err.message);
        res.status(400).json({ message: err.message })
    }

})

// Deleting one Genre
router.delete('/:id', getGenreDelete, async (req, res) => {
    try {
        console.log("Genre DEL: ", "Deleted Genre and associated items");
        res.json({ message: 'Deleted Genre and associated items' })
    } catch (err) {
        console.error("Genre DEL Error: ", err.message);
        res.status(500).json({ message: err.message })
    }
})


// Middleware function for gettig Genre object by ID
async function getGenre(req, res, next) {
    try {
        genre = await genre_db.findById(req.params.id)
        if (genre == null) {
            console.log({ message: 'Cant find Genre' });
            return res.status(404).json({ message: 'Cant find Genre' })
        }
    } catch (err) {
        console.error({ ERRORMSG: err.message });
        return res.status(500).json({ message: err.message })
    }
    res.genre = genre;

    next();
}


// Middleware function for deleting Genre its associated dishes and images object by ID
async function getGenreDelete(req, res, next) {
    genre = [];
    dishes = [];
    images = [];

    // Finding and deleting genre from req
    try {
        genre = await genre_db.findById(req.params.id, { "_id": 1 })
        result = await genre_db.deleteMany({ _id: req.params.id }, { "_id": 1 })
        if (genre == null) {
            console.log({ message: 'Cant find Genre' });
            return res.status(404).json({ message: 'Cant find Genre' })
        }
    } catch (err) {
        console.error({ GENRE_ERRORMSG: err.message });
        return res.status(500).json({ message: err.message })
    }
    genreID = genre._id.toString();
    // console.log("Genre IDs: ", genreID);


    // Finding and deleting Dishes assiciated with deleted genre from req
    try {
        dishes = await dish_db.find({ genre_id: genreID }, { "_id": 1 });
        result = await dish_db.deleteMany({ genre_id: genreID }, { "_id": 1 });
        if (dishes == null) {
            console.log({ message: 'Cant find Dish' });
            return res.status(404).json({ message: 'Cant find Dish' })
        }
    } catch (err) {
        console.error({ DISHES_ERRORMSG: err.message });
        return res.status(500).json({ message: err.message })
    }
    // casting object with _id to ids array of string
    dishesID = dishes.map(d => d._id);
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
        console.error({ IMAGE_ERRORMSG: err.message });
        return res.status(500).json({ message: err.message })
    }
    // res.images = image;
    // ImageID = image.map(d => d._id);
    // console.log("Image IDs: ", ImageID);

    // Finding and deleting RateList assiciated with deleted dishes & genre from req
    try {
        ratelist = await ratelist_db.find({ dish_id: dishesID }, { "_id": 1 });
        result = await ratelist_db.deleteMany({ dish_id: dishesID }, { "_id": 1 });
        if (image == null) {
            console.log({ message: 'Cant find Image' });
            return res.status(404).json({ message: 'Cant find Image' })
        }
    } catch (err) {
        console.error({ IMAGE_ERRORMSG: err.message });
        return res.status(500).json({ message: err.message })
    }
    // res.images = image;
    // ImageID = image.map(d => d._id);
    // console.log("Image IDs: ", ImageID);

    next();
}

module.exports = router;