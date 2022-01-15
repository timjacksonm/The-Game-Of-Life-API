const { query } = require('express-validator');

const validateAndSanitize = (method) => {
  switch (method) {
    case 'wikirandom': {
      return [
        query('count')
          .optional({ checkFalsy: true })
          .isInt({ min: 1, max: 2339 }),
      ];
    }
    case '': {
      return [query('')];
    }
  }
};

module.exports = { validateAndSanitize };
