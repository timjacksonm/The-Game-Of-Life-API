"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAndSanitize = void 0;
const express_validator_1 = require("express-validator");
const customtemplate_1 = __importDefault(require("../models/customtemplate"));
const validateAndSanitize = (method) => {
    switch (method) {
        case 'list': {
            return [
                (0, express_validator_1.query)('limit')
                    .optional({ checkFalsy: true })
                    .isInt({ min: 1, max: 2339 })
                    .withMessage('Invalid value or not within range'),
                (0, express_validator_1.query)('select')
                    .optional({ checkFalsy: true })
                    .isJSON()
                    .withMessage('Invalid JSON with selection')
                    .custom((value) => !JSON.parse(value).some((string) => string === ''))
                    .withMessage('Select value cannot be empty string'),
            ];
        }
        case 'byid': {
            return [
                (0, express_validator_1.check)('id')
                    .isLength({ min: 24, max: 24 })
                    .withMessage('Id must be a length of 24'),
                (0, express_validator_1.query)('select')
                    .optional({ checkFalsy: true })
                    .isJSON()
                    .withMessage('Invalid JSON with selection')
                    .custom((value) => !JSON.parse(value).some((string) => string === ''))
                    .withMessage('Select value cannot be empty string'),
            ];
        }
        case 'bysearch': {
            return [
                (0, express_validator_1.param)('path')
                    .trim()
                    .custom((value) => !/\s/.test(value))
                    .withMessage('1 word limit')
                    .custom((value) => ['author', 'title'].some((string) => string === value))
                    .withMessage('Invalid path parameter'),
                (0, express_validator_1.query)('select')
                    .optional({ checkFalsy: true })
                    .isJSON()
                    .withMessage('Invalid JSON with selection')
                    .custom((value) => !JSON.parse(value).some((string) => string === ''))
                    .withMessage('Select value cannot be empty string'),
                (0, express_validator_1.query)('limit')
                    .optional({ checkFalsy: true })
                    .isInt({ min: 1, max: 2339 })
                    .withMessage('Invalid value or not within range'),
            ];
        }
        case 'create': {
            return [
                (0, express_validator_1.body)('author')
                    .notEmpty()
                    .withMessage('Author must not be empty')
                    .isString()
                    .withMessage('Author is invalid. Must be a string')
                    .isAlpha('en-US', { ignore: ' ' })
                    .withMessage('Author is invalid. Must only contain letters')
                    .trim(),
                (0, express_validator_1.body)('title')
                    .notEmpty()
                    .withMessage('Title must not be empty')
                    .isString()
                    .withMessage('Title is invalid. Must be a string')
                    .isAlphanumeric('en-US', { ignore: ' .!' })
                    .withMessage('Title is invalid. Must only contain letters')
                    .trim()
                    .custom((val) => customtemplate_1.default.isUniqueTitle(val))
                    .withMessage('Title already in use'),
                (0, express_validator_1.body)('description')
                    .notEmpty()
                    .withMessage('Description must not be empty')
                    .isArray()
                    .withMessage('Description is invalid. Must be array')
                    .custom((arr) => arr.map((value) => {
                    if (typeof value === 'string') {
                        return true;
                    }
                    else {
                        throw new Error();
                    }
                }))
                    .withMessage('Description is invalid. Include only strings in array'),
                (0, express_validator_1.body)('size').isObject().withMessage('Size is invalid. Must be object'),
                (0, express_validator_1.body)('size.x')
                    .custom((value) => {
                    if (value.toFixed()) {
                        return true;
                    }
                    else {
                        throw new Error();
                    }
                })
                    .withMessage('Size is invalid. For each key the value must be a number'),
                (0, express_validator_1.body)('size.y')
                    .custom((value) => {
                    if (value.toFixed()) {
                        return true;
                    }
                    else {
                        throw new Error();
                    }
                })
                    .withMessage('Size is invalid. For each key the value must be a number'),
                (0, express_validator_1.body)('rleString')
                    .trim()
                    .notEmpty()
                    .withMessage('rleString must not be empty')
                    .custom((value) => !/\s/.test(value))
                    .withMessage('Invalid rle string. Can\t contain spaces')
                    .custom((string) => {
                    if (/[AaC-Nc-nP-Zp-z\@\_\#\%\^\&\*\(\)\+\=\-\[\]\{\}\;\:\'\"\,\<\.\>\/\?\`\~]/g.test(string)) {
                        throw new Error();
                    }
                    else {
                        return true;
                    }
                })
                    .withMessage('Invalid characters in rle string.'),
            ];
        }
    }
};
exports.validateAndSanitize = validateAndSanitize;
