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
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const TemplateSchema = new mongoose_1.Schema({
    author: {
        type: String,
        trim: true,
        required: true,
    },
    title: {
        type: String,
        trim: true,
        required: true,
    },
    description: {
        type: [String],
        required: true,
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
TemplateSchema.static('isUniqueTitle', function isUniqueTitle(val) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield this.find({ title: val });
        if (result.length) {
            throw new Error();
        }
        else {
            return true;
        }
    });
});
const Template = (0, mongoose_1.model)('CustomTemplate', TemplateSchema);
exports.default = Template;
