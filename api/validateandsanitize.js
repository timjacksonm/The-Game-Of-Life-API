const { query, check, body } = require('express-validator');

const validateAndSanitize = (method) => {
  switch (method) {
    case 'wikirandom': {
      return [
        query('count')
          .optional({ checkFalsy: true })
          .isInt({ min: 1, max: 2339 })
          .withMessage('Invalid value or not within range'),
      ];
    }
    case 'wikibyid': {
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
    case 'wikibysearch': {
      return [
        body('path')
          .isString()
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
  }
};

module.exports = { validateAndSanitize };
