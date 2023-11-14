import { query, check, body } from 'express-validator';
import mongoose from 'mongoose';
import CustomTemplate from '../models/customtemplate';
import { defaultProjection } from '../controllers/wikiPatterns';
import { convertToSelectObject } from '../helpers';

export const validateAndSanitize = (method: string) => {
  switch (method) {
    case 'list':
      return [
        query('offset')
          .optional()
          .isInt({ min: 0, max: 2339 })
          .withMessage('Invalid value or not within range')
          .customSanitizer((value: string) => parseInt(value, 10)),
        query('limit')
          .optional()
          .isInt({ min: 1, max: 2339 })
          .withMessage('Invalid value or not within range')
          .customSanitizer((value: string) => parseInt(value, 10)),
        query('select')
          .optional()
          .isJSON()
          .withMessage('Invalid JSON with selection')
          .customSanitizer((value: string) => JSON.parse(value) as string[])
          .custom((value: string[]) => !value.some((text: string) => text === ''))
          .withMessage('Select value cannot be empty string')
          .custom((value: string[]) =>
            value.every((string: string) =>
              Object.prototype.hasOwnProperty.call(defaultProjection, string),
            ),
          )
          .withMessage(`Selection can only contain: ${Object.keys(defaultProjection).join(', ')}`)
          // converts value into object that will work with mongoDB $project stage
          // i.e. from ["id", "title"] => { id: 1, title: 1 }
          .customSanitizer((value: string[]) => convertToSelectObject(value)),
        query('sort')
          .optional()
          .custom((value: string) => ['asc', 'desc'].includes(value))
          .withMessage('Sort can only be asc or desc'),
      ];
    case 'byid':
      return [
        check('id')
          .isLength({ min: 24, max: 24 })
          .withMessage('Id must be a length of 24')
          .custom((value) => mongoose.isValidObjectId(value))
          .withMessage('Invalid ID, must be a 12-byte ObjectId to be valid.'),
        query('select')
          .optional()
          .isJSON()
          .withMessage('Invalid JSON with selection')
          .customSanitizer((value: string) => JSON.parse(value) as string[])
          .custom((value: string[]) => !value.some((text: string) => text === ''))
          .withMessage('Select value cannot be empty string')
          .custom((value: string[]) =>
            value.every((string: string) =>
              Object.prototype.hasOwnProperty.call(defaultProjection, string),
            ),
          )
          .withMessage(`Selection can only contain: ${Object.keys(defaultProjection).join(', ')}`)
          // converts value into object that will work with mongoDB $project stage
          // i.e. from ["id", "title"] => { id: 1, title: 1 }
          .customSanitizer((value: string[]) => convertToSelectObject(value)),
      ];
    case 'create':
      return [
        body('author')
          .notEmpty()
          .withMessage('Author must not be empty')
          .isString()
          .withMessage('Author is invalid. Must be a string')
          .isAlpha('en-US', { ignore: ' ' })
          .withMessage('Author is invalid. Must only contain letters')
          .trim(),
        body('title')
          .notEmpty()
          .withMessage('Title must not be empty')
          .isString()
          .withMessage('Title is invalid. Must be a string')
          .isAlphanumeric('en-US', { ignore: ' .!' })
          .withMessage('Title is invalid. Must only contain letters')
          .trim()
          .custom((val: string) => CustomTemplate.isUniqueTitle(val))
          .withMessage('Title already in use'),
        body('description')
          .notEmpty()
          .withMessage('Description must not be empty')
          .isArray()
          .withMessage('Description is invalid. Must be array')
          .custom((arr: string[]) =>
            arr.map((value: string) => {
              if (typeof value === 'string') {
                return true;
              } else {
                throw new Error();
              }
            }),
          )
          .withMessage('Description is invalid. Include only strings in array'),
        body('size').isObject().withMessage('Size is invalid. Must be object'),
        body('size.x')
          .custom((value: number) => {
            if (value.toFixed()) {
              return true;
            } else {
              throw new Error();
            }
          })
          .withMessage('Size is invalid. For each key the value must be a number'),
        body('size.y')
          .custom((value: number) => {
            if (value.toFixed()) {
              return true;
            } else {
              throw new Error();
            }
          })
          .withMessage('Size is invalid. For each key the value must be a number'),
        body('rleString')
          .trim()
          .notEmpty()
          .withMessage('rleString must not be empty')
          .custom((value: string) => !/\s/.test(value))
          .withMessage('Invalid rle string. Can\t contain spaces')
          .custom((string: string) => {
            if (/[AaC-Nc-nP-Zp-z@_#%^&*()+=\-[\]{};:'",<.>/?`~]/g.test(string)) {
              throw new Error();
            } else {
              return true;
            }
          })
          .withMessage('Invalid characters in rle string.'),
      ];
    default:
      return [];
  }
};
