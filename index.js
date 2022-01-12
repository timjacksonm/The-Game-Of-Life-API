const express = require('express');
const router = require('./api/index');
const dotenv = require('dotenv');
dotenv.config();
const PORT = process.env.PORT || 8080;

const app = express();

//Set up mongoose connection
const mongoose = require('mongoose');
const readDirFilePath = require('./populatedb');
const mongoDB = process.env.PROD_DB_URL || process.env.DEV_DB_URL;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

readDirFilePath('../../convert/patterns/');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', router);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
