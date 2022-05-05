require('dotenv').config();
const express = require('express');
const server = express();
const cors = require('cors');

// Server config
server.use(express.json());
server.use(cors());

// Mongoose connection and config
const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to database!'));

// Server router link
const router = require('./router/characters-router');
server.use('/characters', router);

// Dishes router link
const dishesRouter = require('./router/dishes-router');
server.use('/dishes', dishesRouter);

// Genre router link
const genreRouter = require('./router/genre-router');
server.use('/genre', genreRouter);

// Images router link
const imagesRouter = require('./router/images-router');
server.use('/images', imagesRouter);

// Order Details router link
const orderDetialRouter = require('./router/orderdetail-router');
server.use('/orderdetail', orderDetialRouter);

// Order List router link
const orderListRouter = require('./router/orderlist-router');
server.use('/orderlist', orderListRouter);

// Ratelist router link
const ratelistRouter = require('./router/ratelist-router');
server.use('/ratelist', ratelistRouter);

// Tables router link
const tablesRouter = require('./router/tables-router');
server.use('/tables', tablesRouter);

// Starting server
server.listen(3000, () => console.log("Server started! http://localhost:3000/"));