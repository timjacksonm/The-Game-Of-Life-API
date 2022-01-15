const express = require('express');
const router = express.Router();
const WikiTemplate = require('../models/template');
const { validateAndSanitize } = require('./validateandsanitize');
const { validationResult } = require('express-validator');
const template_controller = require('../controllers/officialTemplateController');

router.get('/', async (req, res) => {
  res.json({ message: 'Welcome to The Game Of Life API!' });
});

//get random patterns from wikicollection -- options: { count: num }
router.get(
  '/wikicollection/patterns/',
  validateAndSanitize('wikirandom'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors });
    }
    try {
      const count = Number(req.query.count) || 10;
      const response = await WikiTemplate.aggregate([
        { $sample: { size: count } },
      ]);
      res.status(200).json(response);
    } catch (err) {
      res.status(500).json({ message: err });
    }
  }
);

//get wikicollection pattern by :id -- options { select: JSON Array }
router.get(
  '/wikicollection/patterns/:id/:select?',
  validateAndSanitize('wikibyid'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors });
    }
    try {
      const projection = req.query.select ? JSON.parse(req.query.select) : '';
      const response = await WikiTemplate.findById(req.params.id, projection);
      res.status(200).json(response);
    } catch (err) {
      res.status(500).json({ message: err });
    }
  }
);

//find all wikicollection patterns by search -- options { select: JSON Array, count: num }
router.get(
  '/wikicollection/search/:select?',
  validateAndSanitize('wikibysearch'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors });
    }
    if (!req.body.path || !req.body.value) {
      return res.status(400).json({ message: 'Invalid search parameters' });
    }
    try {
      const count = Number(req.query.count) || 10;
      //throw is set for object if there is no selection in query. aggregate doesn't take an array of strings like findByID does for projection :(
      let projection = { throw: 0 };
      if (req.query.select) {
        //creat object of array { field: 1 }
        projection = JSON.parse(req.query.select).reduce(
          (acc, curr) => ((acc[curr] = 1), acc),
          {}
        );
      }

      const response = await WikiTemplate.aggregate([
        {
          $search: {
            index: 'custom',
            text: {
              query: req.body.value,
              path: req.body.path,
            },
          },
        },
        { $project: projection },
        { $sample: { size: count } },
      ]);
      res.status(200).json(response);
    } catch (err) {
      res.status(500).json({ message: err });
    }
  }
);

module.exports = router;
