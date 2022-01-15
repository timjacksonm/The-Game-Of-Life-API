const { query, check } = require('express-validator');

const validateAndSanitize = (method) => {
  switch (method) {
    case 'wikirandom': {
      return [
        query('count')
          .optional({ checkFalsy: true })
          .isInt({ min: 1, max: 2339 }),
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
  }
};

module.exports = { validateAndSanitize };
