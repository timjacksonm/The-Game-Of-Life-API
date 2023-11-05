import { query, check, body, param } from "express-validator";
import mongoose from "mongoose";
import CustomTemplate from "../models/customtemplate";
import { defaultProjection } from "../controllers/WikiCollectionController/wikiCollectionController";
import { convertJSONToObject } from "../helpers";

export const validateAndSanitize = (method: string): any => {
  switch (method) {
    case "list": {
      return [
        query("offset")
          .optional({ checkFalsy: true })
          .isInt({ min: 1, max: 2339 })
          .withMessage("Invalid value or not within range")
          .customSanitizer((value) => parseInt(value, 10)),
        query("limit")
          .optional({ checkFalsy: true })
          .isInt({ min: 1, max: 2339 })
          .withMessage("Invalid value or not within range")
          .customSanitizer((value) => parseInt(value, 10)),
        query("select")
          .optional({ checkFalsy: true })
          .isJSON()
          .withMessage("Invalid JSON with selection")
          .custom(
            (value) =>
              !JSON.parse(value).some((string: string) => string === "")
          )
          .withMessage("Select value cannot be empty string")
          .custom((value) =>
            JSON.parse(value).every((string: string) =>
              defaultProjection.hasOwnProperty(string)
            )
          )
          .withMessage(
            `Selection can only contain: ${Object.keys(defaultProjection).join(
              ", "
            )}`
          )
          // converts JSON string into object that will work with mongoDB $project stage
          // i.e. from ["id", "title"] => { id: 1, title: 1 }
          .customSanitizer((value) => convertJSONToObject(JSON.parse(value))),
      ];
    }
    case "byid": {
      return [
        check("id")
          .isLength({ min: 24, max: 24 })
          .withMessage("Id must be a length of 24")
          .custom((value) => mongoose.isValidObjectId(value))
          .withMessage("Invalid ID, must be a 12-byte ObjectId to be valid."),
        query("select")
          .optional({ checkFalsy: true })
          .isJSON()
          .withMessage("Invalid JSON with selection")
          .custom(
            (value) =>
              !JSON.parse(value).some((string: string) => string === "")
          )
          .withMessage("Select value cannot be empty string")
          .custom((value) =>
            JSON.parse(value).every((string: string) =>
              defaultProjection.hasOwnProperty(string)
            )
          )
          .withMessage(
            `Selection can only contain: ${Object.keys(defaultProjection).join(
              ", "
            )}`
          )
          // converts JSON string into object that will work with mongoDB $project stage
          // i.e. from ["id", "title"] => { id: 1, title: 1 }
          .customSanitizer((value) => convertJSONToObject(JSON.parse(value))),
      ];
    }
    case "bysearch": {
      return [
        param("path")
          .trim()
          .custom((value) => !/\s/.test(value))
          .withMessage("1 word limit")
          .custom((value) =>
            ["author", "title"].some((string) => string === value)
          )
          .withMessage("Invalid path parameter"),
        query("select")
          .optional({ checkFalsy: true })
          .isJSON()
          .withMessage("Invalid JSON with selection")
          .custom(
            (value) =>
              !JSON.parse(value).some((string: string) => string === "")
          )
          .withMessage("Select value cannot be empty string"),
        query("limit")
          .optional({ checkFalsy: true })
          .isInt({ min: 1, max: 2339 })
          .withMessage("Invalid value or not within range"),
      ];
    }
    case "create": {
      return [
        body("author")
          .notEmpty()
          .withMessage("Author must not be empty")
          .isString()
          .withMessage("Author is invalid. Must be a string")
          .isAlpha("en-US", { ignore: " " })
          .withMessage("Author is invalid. Must only contain letters")
          .trim(),
        body("title")
          .notEmpty()
          .withMessage("Title must not be empty")
          .isString()
          .withMessage("Title is invalid. Must be a string")
          .isAlphanumeric("en-US", { ignore: " .!" })
          .withMessage("Title is invalid. Must only contain letters")
          .trim()
          .custom((val: string) => CustomTemplate.isUniqueTitle(val))
          .withMessage("Title already in use"),
        body("description")
          .notEmpty()
          .withMessage("Description must not be empty")
          .isArray()
          .withMessage("Description is invalid. Must be array")
          .custom((arr: string[]) =>
            arr.map((value: string) => {
              if (typeof value === "string") {
                return true;
              } else {
                throw new Error();
              }
            })
          )
          .withMessage("Description is invalid. Include only strings in array"),
        body("size").isObject().withMessage("Size is invalid. Must be object"),
        body("size.x")
          .custom((value) => {
            if (value.toFixed()) {
              return true;
            } else {
              throw new Error();
            }
          })
          .withMessage(
            "Size is invalid. For each key the value must be a number"
          ),
        body("size.y")
          .custom((value) => {
            if (value.toFixed()) {
              return true;
            } else {
              throw new Error();
            }
          })
          .withMessage(
            "Size is invalid. For each key the value must be a number"
          ),
        body("rleString")
          .trim()
          .notEmpty()
          .withMessage("rleString must not be empty")
          .custom((value) => !/\s/.test(value))
          .withMessage("Invalid rle string. Can\t contain spaces")
          .custom((string) => {
            if (
              /[AaC-Nc-nP-Zp-z\@\_\#\%\^\&\*\(\)\+\=\-\[\]\{\}\;\:\'\"\,\<\.\>\/\?\`\~]/g.test(
                string
              )
            ) {
              throw new Error();
            } else {
              return true;
            }
          })
          .withMessage("Invalid characters in rle string."),
      ];
    }
  }
};
