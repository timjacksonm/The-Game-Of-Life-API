"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const TemplateSchema = new mongoose_1.Schema({
    author: {
        type: String,
        trim: true,
    },
    title: {
        type: String,
        trim: true,
    },
    description: {
        type: [Array],
    },
    size: {
        x: { type: Number, required: true },
        y: { type: Number, required: true },
    },
    rleString: {
        type: String,
        required: true,
    },
    date: { type: Date, default: Date.now },
});
const Template = (0, mongoose_1.model)('WikiTemplates', TemplateSchema);
exports.default = Template;
