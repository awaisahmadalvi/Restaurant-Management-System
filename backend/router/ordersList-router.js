const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const order_db = require('../model/ordersList-model');
const orderDetail_db = require('../model/orderDetail-model');
const table_db = require('../model/tables-model');

const getPagination = (page, size) => {
    const limit = size ? +size : 5;
    const offset = page ? page * limit : 0;

    return { limit, offset };
};

function getMatchQuery(isCompleted, period_start, period_end) {
    matchSyntx = []
    if (period_start || period_end)
        matchSyntx.push(
            {
                "$match": {
                    "createdAt": { $gte: new Date(new Date(period_start) - new Date().getTimezoneOffset() * 60000), $lt: new Date(new Date(period_end) - new Date().getTimezoneOffset() * 60000) }
                }
            });
    if (isCompleted != undefined)
        matchSyntx.push(
            {
                "$match": {
                    "is_paid": isCompleted
                    // "is_paid": "No"
                }
            });

    console.log(matchSyntx);
    return matchSyntx
}

router.get('/stats', async (req, res) => {

    const { isCompleted, period_start, period_end } = req.query;

    console.log("REQUEST GETSTAT: ", req.query);

    matchSyntx = getMatchQuery(isCompleted, period_start, period_end);

    query = [
        ...matchSyntx,
        {
            $project: {
                total_bill: { $cond: [{ $isNumber: ['$total_bill'] }, '$total_bill', 0] }
            }
        },
        {
            $group:
            {
                _id: null,
                inflows: {
                    $sum: '$total_bill'

                },
                count: {
                    $sum: 1
                }
            }
        }];

    console.log(query);

    order_db.aggregate(query)
        .then((data) => {
            console.log("Orderlist GETSTAT: ", JSON.stringify(data));

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

router.get('/', async (req, res) => {
    const { page, size, isCompleted, period_start, period_end } = req.query;
    const { limit, offset } = getPagination(page, size);

    console.log("REQUEST: ", req.query);

    matchSyntx = getMatchQuery(isCompleted, period_start, period_end);

    query = [
        ...matchSyntx,
        { $sort: { createdAt: -1 } },
        {
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
        {
            $project: {
                'table.number': 1, table_id: 1, is_paid: 1, total_bill: 1, status: 1, daily_number: 1,
                createdAt: {
                    $dateToString: {
                        format: "%Y-%m-%d %H:%M:%S ",
                        date: "$createdAt"
                    }
                },
                // updatedAt: {
                //     $dateToString: {
                //         format: "%H:%M:%S %Y-%m-%d",
                //         date: "$updatedAt"
                //     }
                // },
            }
        },
        {
            $facet: {
                metadata: [{ $count: "total" }, {
                    $addFields: {
                        page: page,
                    }
                }],
                docs: [{ $skip: offset }, { $limit: limit }] // add projection here wish you re-shape the docs
            }
        }];

    console.log(query);

    order_db.aggregate(query)
        .then((data) => {
            console.log("Orderlist GET: ", JSON.stringify(data));

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

// Creating an order
router.post('/', async (req, res) => {
    console.log("Post order", req.body);
    orderCountObj = await order_db.find({ createdAt: { $gte: new Date(new Date().toISOString().split('T')[0]) } }, { daily_number: 1, _id: 0 }).sort({ daily_number: -1 }).limit(1);
    console.log("orderCountObj:", orderCountObj);
    orderCount = 0;
    if (orderCountObj.length > 0)
        orderCount = orderCountObj[0].daily_number;
    orderList = new order_db({
        table_id: req.body.table_id,
        is_paid: req.body.is_paid,
        total_bill: req.body.total_bill,
        status: req.body.status,
        daily_number: parseInt(orderCount) + 1,
    });
    try {
        newOrder = await orderList.save();
        setOrderInTable(newOrder);
        console.log("Orderlist POST: ", newOrder);
        res.status(201).json(newOrder);
    } catch (err) {
        console.error("Orderlist POST Error: ", err.message);
        res.status(400).json({ message: err.message });
    }
});

// Updating one order
router.patch('/:id', getOrdersList, async (req, res) => {
    if (req.body.table_id != null) {
        res.orderList.table_id = req.body.table_id
    }
    if (req.body.is_paid != null) {
        res.orderList.is_paid = req.body.is_paid
    }
    if (req.body.total_bill != null) {
        res.orderList.total_bill = req.body.total_bill
    }
    if (req.body.status != null) {
        res.orderList.status = req.body.status
    }
    if (req.body.daily_number != null) {
        res.orderList.daily_number = req.body.daily_number
    }


    try {
        updatedOrderList = await res.orderList.save()
        setOrderInTable(updatedOrderList)
        console.log("Orderlist PATCH: ", updatedOrderList);
        res.json(updatedOrderList)
    } catch (err) {
        console.log("Orderlist PATCH Error: ", err.message);
        res.status(400).json({ message: err.message });
    }

})

// Deleting one order
// router.delete('/:id', getOrdersList, async (req, res) => {
router.delete('/:id', delOrdersList, async (req, res) => {
    try {
        console.log("Orderlist DEL: ", 'Deleted Order');
        res.json({ message: 'Deleted Order' })
    } catch (err) {
        console.error("Orderlist DEL Error: ", err.message);
        res.status(500).json({ message: err.message })
    }
})



// Middleware function for deleting order and its details (orderDetails) object by ID
async function delOrdersList(req, res, next) {
    try {

        orderList = await order_db.findByIdAndRemove(req.params.id)
        table = await table_db.findOneAndUpdate({ _id: orderList.table_id }, { "order_id": ["-1"] });
        orderDetail = await orderDetail_db.deleteMany({ "order_id": req.params.id })
        // console.log("orderList deleted", orderList);
        // console.log(orderDetail);
        // await orderList.remove()
        // await orderDetail.deleteMany()

        if (orderList == null) {
            return res.status(404).json({ message: 'Cant find OrderList' })
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }

    next()
}

// Middleware function for gettig order object by ID
async function getOrdersList(req, res, next) {
    try {
        orderList = await order_db.findById(req.params.id)
        if (orderList == null) {
            return res.status(404).json({ message: 'Cant find OrderList' })
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }

    res.orderList = orderList;
    next()
}

async function setOrderInTable(newOrder) {
    console.log("setOrderInTable:", newOrder);

    if (newOrder.status.toString() === "Completed") {
        table = await table_db.findOneAndUpdate({ _id: newOrder.table_id }, { "order_id": ["-1"] });
        console.log("COMPLETED : YES");
        console.log("table after edit", table);
    } else {
        table = await table_db.findOneAndUpdate({ "_id": newOrder.table_id, "number": { $ne: "Take Away" } }, { "order_id": [newOrder.daily_number] });
        console.log("COMPLETED : NO");
        console.log("table after edit", table);
    }
    // return orderCount
}

module.exports = router;