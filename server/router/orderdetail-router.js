const express = require('express');
const router = express.Router();
const orderdetail_db = require('../model/orderdetail-model');

// Getting all orderdetail
router.get('/', async (req, res) => {
    try {
        const ordersdetail = await orderdetail_db.find();
        res.json(ordersdetail);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Creating an orderdetail
router.post('/', async (req, res) => {
    const ordersdetail = new orderdetail_db({
        table_id: req.body.table_id,
        is_paid: req.body.is_paid,
        total_bill: req.body.total_bill,
        status: req.body.status,
    });
    try {
        const newOrder = await ordersdetail.save();
        res.status(201).json(newOrder);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


// Getting one orderdetail
router.get('/:id', getOrderDetail, (req, res) => {
    res.json(res.ordersdetail)
});

// Updating one orderdetail
router.patch('/:id', getOrderDetail, async (req, res) => {
    if (req.body.table_id != null) {
        res.ordersdetail.table_id = req.body.table_id
    }
    if (req.body.is_paid != null) {
        res.ordersdetail.is_paid = req.body.is_paid
    }
    if (req.body.total_bill != null) {
        res.ordersdetail.total_bill = req.body.total_bill
    }
    if (req.body.status != null) {
        res.ordersdetail.status = req.body.status
    }

    try {
        const updatedOrderDetail = await res.ordersdetail.save()
        res.json(updatedOrderDetail)
    } catch {
        res.status(400).json({ message: err.message })
    }

})

// Deleting one orderdetail
router.delete('/:id', getOrderDetail, async (req, res) => {
    try {
        await res.ordersdetail.remove()
        res.json({ message: 'Deleted This OrderDetail' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})



// Middleware function for gettig orderdetail object by ID
async function getOrderDetail(req, res, next) {
    try {
        ordersdetail = await orderdetail_db.findById(req.params.id)
        if (ordersdetail == null) {
            return res.status(404).json({ message: 'Cant find OrderDetail' })
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }

    res.ordersdetail = ordersdetail;
    next()
}

module.exports = router;