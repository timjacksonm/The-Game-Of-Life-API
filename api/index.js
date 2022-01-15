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

//get pattern by :id options {select: JSON Array}
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

//get all pattern names options: {includedescriptions: 0 || 1}
router.get('/:collection/titles', async (req, res) => {});

//find pattern by title
router.get('/:collection/:title', async (req, res) => {});

//find pattern by author
router.get('/:collection/:author', async (req, res) => {});

module.exports = router;
