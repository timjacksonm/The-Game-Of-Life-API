const { query, check, body, param } = require('express-validator');
const CustomTemplates = require('../models/customtemplate');

const validateAndSanitize = (method) => {
  switch (method) {
    case 'list': {
      return [
        query('count')
          .optional({ checkFalsy: true })
          .isInt({ min: 1, max: 2339 })
          .withMessage('Invalid value or not within range'),
        query('select')
          .optional({ checkFalsy: true })
          .isJSON()
          .withMessage('Invalid JSON with selection'),
      ];
    }
    case 'byid': {
      return [
        check('id')
          .isLength({ min: 24, max: 24 })
          .withMessage('Id must be a length of 24'),
        query('select')
          .optional({ checkFalsy: true })
          .isJSON()
          .withMessage('Invalid JSON with selection'),
      ];
    }
    case 'bysearch': {
      return [
        param('path')
          .trim()
          .custom((value) => !/\s/.test(value))
          .withMessage('1 word limit')
          .custom((value) =>
            ['author', 'title'].some((string) => string === value)
          )
          .withMessage('Invalid path parameter'),
        query('select')
          .optional({ checkFalsy: true })
          .isJSON()
          .withMessage('Invalid JSON with selection'),
        query('count')
          .optional({ checkFalsy: true })
          .isInt({ min: 1, max: 2339 })
          .withMessage('Invalid value or not within range'),
      ];
    }
    case 'create': {
      return [
        body('author').notEmpty().withMessage('Author is invalid.').trim(),
        body('title')
          .notEmpty()
          .withMessage('Title is invalid.')
          .trim()
          .custom((val) => CustomTemplates.isUniqueTitle(val))
          .withMessage('Title already in use'),
        body('description')
          .notEmpty()
          .withMessage('Description is invalid.')
          .isJSON()
          .withMessage('Invalid JSON with description'),
        body('size')
          .notEmpty()
          .withMessage('Size is invalid.')
          .isJSON()
          .withMessage('Invalid JSON with size'),
        body('rleString')
          .trim()
          .notEmpty()
          .withMessage('rleString is invalid.')
          .custom((value) => !/\s/.test(value))
          .withMessage('Invalid rle string. Can\t contain spaces')
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
          .withMessage('Invalid characters in rle string.'),
      ];
    }
  }
};

module.exports = { validateAndSanitize };
