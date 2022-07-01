const express = require('express');
const router = express.Router();
const order_db = require('../model/ordersList-model');
const mongoose = require('mongoose');

// Getting all order
router.get('/', getOrderDetailwTable, async (req, res) => {
    try {
        // const ordersdetail = await order_db.find();

        // res.status(200).json(res.ordersdetail)
        console.log("Orderlist GET: ", res.ordersdetail);
        res.json(res.ordersdetail);
    } catch (err) {
        console.log("Orderlist GET Error: ", err.message);
        res.status(500).json({ message: err.message });
    }
});

// Creating an order
router.post('/', async (req, res) => {
    console.log("Post order", req.body);
    const ordersdetail = new order_db({
        table_id: req.body.table_id,
        is_paid: req.body.is_paid,
        total_bill: req.body.total_bill,
        status: req.body.status,
    });
    try {
        const newOrder = await ordersdetail.save();
        console.log("Orderlist POST: ", newOrder);
        res.status(201).json(newOrder);
    } catch (err) {
        console.log("Orderlist POST Error: ", err.message);
        res.status(400).json({ message: err.message });
    }
});


// Getting one order
router.get('/:id', getOrderDetailwTable, (req, res) => {
    console.log("Orderlist GET ID: ", res.ordersdetail);
    res.json(res.ordersdetail)
});

// Updating one order
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
        console.log("Orderlist PATCH: ", updatedOrderDetail);
        res.json(updatedOrderDetail)
    } catch {
        console.log("Orderlist PATCH Error: ", err.message);
        res.status(400).json({ message: err.message })
    }

})

// Deleting one order
router.delete('/:id', getOrderDetail, async (req, res) => {
    try {
        await res.ordersdetail.remove()
        console.log("Orderlist DEL: ", 'Deleted This OrderDetail');
        res.json({ message: 'Deleted This OrderDetail' })
    } catch (err) {
        console.log("Orderlist DEL Error: ", err.message);
        res.status(500).json({ message: err.message })
    }
})



// Middleware function for gettig order object by ID
async function getOrderDetail(req, res, next) {
    try {

        ordersdetail = await order_db.findById(req.params.id)
        if (ordersdetail == null) {
            return res.status(404).json({ message: 'Cant find OrderDetail' })
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }

    res.ordersdetail = ordersdetail;
    next()
}

// Middleware function for gettig order object by ID
async function getOrderDetailwTable(req, res, next) {
    try {
        ordersdetail = await order_db.aggregate([
            {
                $match: (req.params.id ? {
                    "_id": mongoose.Types.ObjectId(req.params.id)
                } : {})
            }, {
                $lookup:
                {
                    from: 'tables',
                    pipeline: [
                        { $project: { number: 1, _id: 0 } }
                    ],
                    localField: 'table_id',
                    foreignField: '_id',
                    as: 'table'
                }
            },
            { $project: { 'table.number': 1, table_id: 1, is_paid: 1, total_bill: 1, status: 1, createdAt: 1, updatedAt: 1, }, }
        ]);
        // console.log("RESULTTTTTT: ", JSON.stringify(ordersdetail));
        // console.log("ASDASDSADAS: ", JSON.stringify(ordersdetail[0].table[0].number));

        // ordersdetail = await order_db.findById(req.params.id)
        // console.log("RESULTTTTTT: ", JSON.stringify(ordersdetail));
        if (ordersdetail == null) {
            return res.status(404).json({ message: 'Cant find OrderDetail' })
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }

    res.ordersdetail = ordersdetail;
    // res.ordersdetail = ordersdetail[0];
    next()
}

module.exports = router;