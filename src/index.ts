import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import compression from 'compression';
import router from './controllers/home';
import wikiRoutes from './controllers/WikiCollectionController';
import customRoutes from './controllers/CustomCollectionController';
import {
  errorLogger,
  errorResponder,
  invalidPathHandler,
} from './errorhandler';

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

app.get('/', router);
app.use('/', wikiRoutes);
app.use('/', customRoutes);

app.use(errorLogger);
app.use(errorResponder);
app.use(invalidPathHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
