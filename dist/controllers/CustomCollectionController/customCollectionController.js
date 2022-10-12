"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const helpers_1 = require("../../helpers");
const validateandsanitize_1 = require("../validateandsanitize");
const customtemplate_1 = __importDefault(require("../../models/customtemplate"));
const home_1 = require("../home");
const { decode } = require('rle-decoder');
const router = express_1.default.Router();
//**GET** patterns from customcollection sorted small -> large -- options { select: JSON Array, count: num }
router.get('/customcollection/patterns', (0, validateandsanitize_1.validateAndSanitize)('list'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { limit = 100, select } = req.query;
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            (0, home_1.logError)(`Validation Error: ${JSON.stringify(errors)}`);
            return res.status(400).json({ message: errors });
        }
        const projection = select ? (0, helpers_1.convertJSONToObject)(select) : { throw: 0 };
        const response = yield customtemplate_1.default.aggregate([
            { $sort: { 'size.x': 1, 'size.y': 1 } },
            { $project: projection },
            { $limit: Number(limit) },
        ]);
        if (!response) {
            (0, home_1.logError)(`NotFoundError: /customcollection/patterns No patterns found`);
            res.status(404).json({ message: 'No patterns found' });
        }
        res.status(200).json(response);
    }
    catch (err) {
        (0, home_1.logError)(`Error: GET /customcollection/patterns ${err.message}`);
        res.status(500).json({ message: err });
    }
}));
//**GET** customcollection pattern by :id -- options { select: JSON Array }
router.get('/customcollection/patterns/:id', (0, validateandsanitize_1.validateAndSanitize)('byid'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { select } = req.query;
        const { id } = req.params;
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            (0, home_1.logError)(`Validation Error: ${JSON.stringify(errors)}`);
            return res.status(400).json({ message: errors });
        }
        const projection = select ? (0, helpers_1.convertJSONToObject)(select) : { throw: 0 };
        const found = yield customtemplate_1.default.findById(id, projection);
        if (!found) {
            (0, home_1.logError)(`NotFoundError: customcollection Pattern ${id}`);
            res.status(404).json({ message: 'Pattern id not found.' });
        }
        if (found) {
            found.rleString = decode(found.rleString, found.size);
            res.status(200).json(found);
        }
    }
    catch (err) {
        (0, home_1.logError)(`Error: GET /customcollection/patterns/:id ${err.message}`);
        res.status(500).json({ message: err });
    }
}));
// TODO: refactor POST/DELETE routes
//**Post** save new pattern to CustomTemplates in db
router.post('/customcollection/patterns', (0, validateandsanitize_1.validateAndSanitize)('create'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { author, title, description, size, rleString } = req.body;
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            (0, home_1.logError)(`Validation Error: ${JSON.stringify(errors)}`);
            return res.status(400).json({ message: errors });
        }
        const pattern = yield customtemplate_1.default.create({
            author,
            title,
            description,
            size,
            rleString,
        });
        res.status(201).json(pattern);
    }
    catch (err) {
        (0, home_1.logError)(`Error: POST /customcollection/patterns ${err.message}`);
        res.status(500).json({ message: err });
    }
}));
//**Post** delete a pattern in CustomTemplates db
router.delete('/customcollection/patterns/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const found = yield customtemplate_1.default.findById({ _id: id });
        if (!found) {
            (0, home_1.logError)(`NotFoundError: Pattern ${id}`);
            res.status(404).json({ message: 'Pattern id not found.' });
        }
        const deleted = yield customtemplate_1.default.findByIdAndDelete({
            _id: id,
        });
        if (deleted) {
            res.status(200).json({ message: `The pattern ${id} has been deleted` });
        }
    }
    catch (err) {
        (0, home_1.logError)(`Error: DELETE /customcollection/patterns/:id ${err.message}`);
        res.status(500).json({ message: err });
    }
}));
exports.default = router;
