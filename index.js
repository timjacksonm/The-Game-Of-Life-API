const express = require('express');
const createError = require('http-errors');
const router = require('./controllers/index');
const dotenv = require('dotenv');
const helmet = require('helmet');
const compression = require('compression');
const errorHandler = require('./errorhandler');
const debug = require('debug')('startup:app');
dotenv.config();
const PORT = process.env.PORT || 8080;

const app = express();

app.use(compression());

app.use(helmet());

//Set up mongoose connection
const mongoose = require('mongoose');
const mongoDB = process.env.PROD_DB_URL || process.env.DEV_DB_URL;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', router);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

app.use(errorHandler);

app.listen(PORT, () => debug(`Server running on port ${PORT}`));
