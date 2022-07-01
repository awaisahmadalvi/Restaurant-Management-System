const express = require('express');
const router = express.Router();
const orderDetail_db = require('../model/orderDetail-model');

// Getting all orderDetail
router.get('/', async (req, res) => {
    try {
        const orderDetail = await orderDetail_db.find();
        console.log("OrderDetail GET: ", orderDetail);
        res.json(orderDetail);
    } catch (err) {
        console.log("OrderDetail GET Error: ", err.message);
        res.status(500).json({ message: err.message });
    }
});

// Creating an orderDetail
router.post('/', async (req, res) => {
    const orderDetail = new orderDetail_db({
        order_id: req.body.order_id,
        rate_id: req.body.rate_id,
        rate: req.body.rate,
    });
    try {
        const newOrderList = await orderDetail.save();
        console.log("OrderDetail POST: ", newOrderList);
        res.status(201).json(newOrderList);
    } catch (err) {
        console.log("OrderDetail POST Error: ", err.message);
        res.status(400).json({ message: err.message });
    }
});

// Getting one orderDetail
router.get('/:id', getOrderList, (req, res) => {
    console.log("OrderDetail GET ID: ", res.orderDetail);
    res.json(res.orderDetail)
});

// Updating one orderDetail
router.patch('/:id', getOrderList, async (req, res) => {
    if (req.body.order_id != null) {
        res.orderDetail.order_id = req.body.order_id
    }
    if (req.body.rate_id != null) {
        res.orderDetail.rate_id = req.body.rate_id
    }
    if (req.body.rate != null) {
        res.orderDetail.rate = req.body.rate
    }

    try {
        const updatedOrderList = await res.orderDetail.save()
        console.log("OrderDetail PATCH: ", updatedOrderList);
        res.json(updatedOrderList)
    } catch {
        console.log("OrderDetail PATCH Error: ", err.message);
        res.status(400).json({ message: err.message })
    }

})

// Deleting one orderDetail
router.delete('/:id', getOrderList, async (req, res) => {
    try {
        await res.orderDetail.remove()
        console.log("OrderDetail DEL: ", 'Deleted This orderDetail');
        res.json({ message: 'Deleted This orderDetail' })
    } catch (err) {
        console.log("OrderDetail DEL Error: ", err.message);
        res.status(500).json({ message: err.message })
    }
})



// Middleware function for gettig orderDetail object by ID
async function getOrderList(req, res, next) {
    try {
        orderDetail = await orderDetail_db.findById(req.params.id)
        if (orderDetail == null) {
            return res.status(404).json({ message: 'Cant find orderDetail' })
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }

    res.orderDetail = orderDetail;
    next()
}
module.exports = router;