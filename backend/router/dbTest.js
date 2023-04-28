const mongoose = require('mongoose');

var MongoClient = require('mongodb').MongoClient;

var url = "mongodb://localhost:27017/";

MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("rms_db");

    dbo.collection('dishes').aggregate([

        { $match: { "_id": mongoose.Types.ObjectId("62b4623428ff12008cfd69e5") } },
        {
            $lookup:
            {
                from: 'genres',
                // pipeline: [
                //     { $project: { name: 1, _id: 0 } }
                // ],
                localField: 'genre_id',
                foreignField: '_id',
                as: 'genre'
            }
        },
        { $project: { name: 1, _id: 0, 'genre.name': 1 }, }
    ]).toArray(function (err, res) {
        if (err) throw err;
        console.log(JSON.stringify(res));
        db.close();
    });
});