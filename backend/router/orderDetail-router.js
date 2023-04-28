const express = require('express');
const router = express.Router();
const orderDetail_db = require('../model/orderDetail-model');
const mongoose = require('mongoose');

function getMatchQuery(isCompleted, period_start, period_end) {
    matchSyntx = []
    if (period_start || period_end)
        matchSyntx.push(
            {
                "$match": {
                    "createdAt": { $gte: new Date(new Date(period_start) - new Date().getTimezoneOffset() * 60000), $lt: new Date(new Date(period_end) - new Date().getTimezoneOffset() * 60000) }
                }
            });
    console.log("OrderDetail-router matchSyntx: ", matchSyntx);
    return matchSyntx
}

router.get('/stats', async (req, res) => {

    const { period_start, period_end } = req.query;

    console.log("OrderDetail-router", "REQUEST GETSTAT: ", req.query);

    matchSyntx = getMatchQuery(period_start, period_end);

    query = [
        ...matchSyntx,
        {
            $project: {
                qty: 1
            }
        },
        {
            $group:
            {
                _id: null,
                total_dishes: {
                    $sum: '$qty'
                }
            }
        }
    ];

    console.log("OrderDetail-router query: ", query);

    orderDetail_db.aggregate(query)
        .then((data) => {
            console.log("OrderDetail-router", "GETSTAT: ", JSON.stringify(data));

            res.send(data);
        })
        .catch((err) => {
            console.error("OrderDetail GET Error: ", err);
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving tutorials.",
            });
        });
});


// Getting all orderDetail
router.get('/', async (req, res) => {
    try {
        const orderDetail = await orderDetail_db.find();
        console.log("OrderDetail-router", " GET: ", orderDetail);
        res.json(orderDetail);
    } catch (err) {
        console.error("OrderDetail GET Error: ", err.message);
        res.status(500).json({ message: err.message });
    }
});

// Creating an orderDetail
router.post('/', async (req, res) => {
    // console.log("OrderDetail-router", req.body);
    // const orderDetail = new orderDetail_db(req.body.array);
    try {
        const newOrderDetail = await orderDetail_db.insertMany(req.body.orderDetail);
        console.log("OrderDetail-router", " POST: ", newOrderDetail);

        res.status(201).json(newOrderDetail);
    } catch (err) {
        console.error("OrderDetail POST Error: ", err.message);
        res.status(400).json({ message: err.message });
    }
});

// Getting one orderDetail
router.get('/:id', getOrderDetail, (req, res) => {
    console.log("OrderDetail-router", " GET ID: ", res.orderDetail);
    res.json(res.orderDetail)
});

// Updating one orderDetail
router.patch('/:id', getOrderDetail, async (req, res) => {
    if (req.body.order_id != null) {
        res.orderDetail.order_id = req.body.order_id
    }
    if (req.body.rate_id != null) {
        res.orderDetail.rate_id = req.body.rate_id
    }
    if (req.body.price != null) {
        res.orderDetail.price = req.body.price
    }
    if (req.body.qty != null) {
        res.orderDetail.qty = req.body.qty
    }

    try {
        const updatedOrderDetail = await res.orderDetail.save()
        console.log("OrderDetail-router", " PATCH: ", updatedOrderDetail);
        res.json(updatedOrderDetail)
    } catch {
        console.log("OrderDetail-router", " PATCH Error: ", err.message);
        res.status(400).json({ message: err.message })
    }

})

// Deleting one orderDetail
router.delete('/:id', getOrderDetail, async (req, res) => {
    try {
        await res.orderDetail.remove()
        console.log("OrderDetail-router", " DEL: ", 'Deleted This orderDetail');
        res.json({ message: 'Deleted This orderDetail' })
    } catch (err) {
        console.error("OrderDetail DEL Error: ", err.message);
        res.status(500).json({ message: err.message })
    }
})



// Middleware function for gettig orderDetail object by ID
async function getOrderDetail(req, res, next) {
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



// Getting all orderDetail
router.get('/orderid/:id', async (req, res) => {
    var orderDetail;
    try {
        orderDetail = await orderDetail_db.aggregate([
            {
                $match: (req.params.id ? {
                    "order_id": mongoose.Types.ObjectId(req.params.id)
                } : {})
            }, {
                $lookup: {
                    from: "ratelists",
                    let: {
                        rateid: "$rate_id"
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: [
                                        "$_id",
                                        "$$rateid"
                                    ]
                                }
                            }
                        },
                        {
                            $lookup: {
                                from: "dishes",
                                let: {
                                    dishid: "$dish_id"
                                },
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: {
                                                $eq: [
                                                    "$_id",
                                                    "$$dishid"
                                                ]
                                            }
                                        }
                                    },
                                    {
                                        $project: {
                                            'name': 1, 'desc': 1, '_id': 0
                                        }
                                    }

                                ],
                                as: "dish"

                            }
                        },
                        {
                            $project: {
                                'name': 1, 'desc': 1, 'price': 1, '_id': 0, 'dish': 1
                            }
                        }
                    ],
                    as: "rate"
                }
            },
            {
                $project: {
                    'dish.name': 1, 'rate': 1, price: 1, qty: 1,
                    createdAt: {
                        $dateToString: {
                            format: "%H:%M:%S %Y-%m-%d",
                            date: "$createdAt"
                        }
                    },
                    updatedAt: {
                        $dateToString: {
                            format: "%H:%M:%S %Y-%m-%d",
                            date: "$updatedAt"
                        }
                    },
                }
            }
        ]);



        // const orderDetail = await orderDetail_db.find({ order_id: req.params.id });
        console.log("OrderDetail-router", " ORDERID GET: ", orderDetail);
        res.json(orderDetail);

    } catch (err) {
        console.error("OrderDetail ORDERID GET Error: ", err.message);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;