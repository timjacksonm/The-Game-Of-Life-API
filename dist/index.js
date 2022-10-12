"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const home_1 = __importDefault(require("./controllers/home"));
const WikiCollectionController_1 = __importDefault(require("./controllers/WikiCollectionController"));
const CustomCollectionController_1 = __importDefault(require("./controllers/CustomCollectionController"));
const errorhandler_1 = require("./errorhandler");
const whitelist = (_a = process.env.SITES) === null || _a === void 0 ? void 0 : _a.split(', ');
dotenv_1.default.config();
const PORT = process.env.PORT || 8080;
const app = (0, express_1.default)();
app.use((0, compression_1.default)());
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: whitelist,
    methods: 'GET, POST, DELETE',
}));
//logs any incoming requests
app.use((0, morgan_1.default)('combined', { stream: { write: (msg) => (0, errorhandler_1.info)(msg) } }));
//Set up mongoose connection
const mongoose = require('mongoose');
const mongoDB = process.env.PROD_DB_URL || process.env.DEV_DB_URL;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', (err) => (0, errorhandler_1.error)('MongoDB connection error: ' + err.message));
db.on('connected', () => (0, errorhandler_1.info)('MongoDB connection established successfully'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.get('/', home_1.default);
app.use('/', WikiCollectionController_1.default);
app.use('/', CustomCollectionController_1.default);
app.use(errorhandler_1.errorLogger);
app.use(errorhandler_1.errorResponder);
app.use(errorhandler_1.invalidPathHandler);
app.listen(PORT, () => (0, errorhandler_1.info)(`CORS-enabled web server listening on port ${PORT}`));
