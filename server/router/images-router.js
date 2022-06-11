const express = require('express');
const router = express.Router();
const image_db = require('../model/images-model');

// *******************************************
// Image object CRUD
// *******************************************

router.get('/', async (req, res) => {
    try {
        const images = await image_db.find();
        res.json(images);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create new image associated to a dish id
router.post('/', async (req, res) => {
    const image = new image_db({
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

// Getting one image using image id
router.get('/:id', getImage, (req, res) => {
    res.json(res.image)
});

// Updating one image using image id
router.patch('/:id', getImage, async (req, res) => {
    if (req.body.dish_id != null) {
        res.image.dish_id = req.body.dish_id
    }
    if (req.body.image_data != null) {
        res.image.image_data = req.body.image_data
    }

    try {
        const updatedImage = await res.image.save()
        res.json(updatedImage)
    } catch {
        res.status(400).json({ message: err.message })
    }

})

// Deleting one image using image id
router.delete('/:id', getImage, async (req, res) => {
    try {
        await res.image.remove()
        res.json({ message: 'Deleted This Image' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// Middleware function for gettig image object by ID
async function getImage(req, res, next) {
    try {
        image = await image_db.findById(req.params.id)
        if (image == null) {
            return res.status(404).json({ message: 'Cant find Image' })
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }

    res.image = image;
    next()
}


// *******************************************
// Image logic function, association with dish id
// *******************************************

// Get all images related to a dish id
router.get('/dishid/:id', async (req, res) => {
    try {
        const images = await image_db.find({ dish_id: req.params.id });
        res.json(images);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Deleting All images associated with a dish id
router.delete('/dishid/:id', removeImagesByDish, async (req, res) => {
    try {
        res.json({ message: 'Deleted This Image' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// Middleware function for gettig images by dish id
async function removeImagesByDish(req, res, next) {
    try {
        image = await image_db.remove({ dish_id: req.params.id })
        if (image == null) {
            return res.status(404).json({ message: 'Cant find Image' })
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }

    res.image = image;
    next()
}


module.exports = router;