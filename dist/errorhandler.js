"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = exports.error = exports.info = exports.invalidPathHandler = exports.errorResponder = exports.errorLogger = void 0;
const debug_1 = __importDefault(require("debug"));
const info = (0, debug_1.default)('app:info');
exports.info = info;
info.log = console.info.bind(console);
const error = (0, debug_1.default)('app:error');
exports.error = error;
error.log = console.error.bind(console);
const logger = (0, debug_1.default)('app:log');
exports.logger = logger;
logger.log = console.log.bind(console);
const errorLogger = (err, req, res, next) => {
    const msg = `error ${err.message}`;
    error(msg);
    next(error);
};
exports.errorLogger = errorLogger;
const errorResponder = (err, req, res, next) => {
    res.header('Content-Type', 'application/json');
    const status = err.statusCode || 400;
    res.status(status).send(err.message);
};
exports.errorResponder = errorResponder;
const invalidPathHandler = (req, res) => {
    error(`404: invalid path ${req.path}`);
    res.status(404).send('invalid path');
};
exports.invalidPathHandler = invalidPathHandler;
