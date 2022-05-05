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


// Starting server
server.listen(3000, () => console.log("Server started! http://localhost:3000/"));