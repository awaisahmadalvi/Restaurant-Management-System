const express = require('express');
const router = express.Router();
const table_db = require('../model/tables-model');

// Getting all tables
router.get('/', async (req, res) => {
    try {
        const tabels = await table_db.find();
        res.json(tabels);
    } catch (err) {
        console.log({ message: err.message });
        res.status(500).json({ message: err.message });
    }
});

// Creating an table
router.post('/', async (req, res) => {
    const table = new table_db({
        number: req.body.number,
        order_id: req.body.order_id,
    });
    try {
        // const newTable = await table.save();

        const newTable = await table.save();

        res.status(201).json(newTable);
    } catch (err) {
        console.error({ message: err.message });
        res.status(400).json({ message: err.message });
    }
});

// Getting one table
router.get('/:id', getTables, async (req, res) => {
    if (res.tables)
        res.json(res.tables);
});

// Updating one table
router.patch('/:id', getTables, async (req, res) => {
    if (req.body.order_id != null) {
        res.tables.order_id = req.body.order_id
    }

    try {
        const updatedTable = await res.tables.save()
        res.json(updatedTable)
    } catch {
        console.log({ message: err.message });
        res.status(400).json({ message: err.message })
    }

})

// Deleting one table
router.delete('/:id', getTables, async (req, res) => {
    try {
        await res.tables.remove()
        res.json({ message: 'Deleted This table' })
    } catch (err) {
        console.log({ message: err.message });
        res.status(500).json({ message: err.message })
    }
})



// Middleware function for gettig ratelist object by ID
async function getTables(req, res, next) {
    try {
        tables = await table_db.findById(req.params.id)
        if (tables == null) {
            return res.status(404).json({ message: 'Cant find table' })
        }
    } catch (err) {
        console.log({ message: err.message });
        return res.status(500).json({ message: err.message })
    }

    res.tables = tables;
    next()
}
module.exports = router;