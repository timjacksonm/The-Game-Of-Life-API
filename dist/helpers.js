"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertJSONToObject = void 0;
const convertJSONToObject = (value) => {
    return JSON.parse(value).reduce((acc, curr) => ((acc[curr] = 1), acc), {});
};
exports.convertJSONToObject = convertJSONToObject;
