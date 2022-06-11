const express = require('express');
const router = express.Router();
const orderlist_db = require('../model/orderdetail-model');

// Getting all orderlist
router.get('/', async (req, res) => {
    try {
        const orderslist = await orderlist_db.find();
        res.json(orderslist);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Creating an orderlist
router.post('/', async (req, res) => {
    const orderslist = new orderlist_db({
        order_id: req.body.order_id,
        rate_id: req.body.rate_id,
        rate: req.body.rate,
    });
    try {
        const newOrderList = await orderslist.save();
        res.status(201).json(newOrderList);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Getting one orderlist
router.get('/:id', getOrderList, (req, res) => {
    res.json(res.orderslist)
});

// Updating one orderlist
router.patch('/:id', getOrderList, async (req, res) => {
    if (req.body.order_id != null) {
        res.orderslist.order_id = req.body.order_id
    }
    if (req.body.rate_id != null) {
        res.orderslist.rate_id = req.body.rate_id
    }
    if (req.body.rate != null) {
        res.orderslist.rate = req.body.rate
    }

    try {
        const updatedOrderList = await res.orderslist.save()
        res.json(updatedOrderList)
    } catch {
        res.status(400).json({ message: err.message })
    }

})

// Deleting one orderlist
router.delete('/:id', getOrderList, async (req, res) => {
    try {
        await res.orderslist.remove()
        res.json({ message: 'Deleted This orderlist' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})



// Middleware function for gettig orderlist object by ID
async function getOrderList(req, res, next) {
    try {
        orderlist = await orderlist_db.findById(req.params.id)
        if (orderlist == null) {
            return res.status(404).json({ message: 'Cant find orderlist' })
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }

    res.orderslist = orderlist;
    next()
}
module.exports = router;