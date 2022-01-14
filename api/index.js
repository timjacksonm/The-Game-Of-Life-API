const express = require('express');
const router = express.Router();
const WikiTemplate = require('../models/template');
const template_controller = require('../controllers/officialTemplateController');

//get random pattern
router.get('/:collection/pattern', async (req, res) => {
  const { collection } = req.params;

  switch (collection) {
    case 'wikitemplates':
      const response = await WikiTemplate.findOne();
      res.status(200).json(response);
      break;
    case 'customtemplates':
      res.send('test');
      break;

    default:
      res.status(400).json({ message: 'collection not found.' });
      break;
  }
});

//get random patterns options: {howmany: num}
router.get('/:collection/patterns', async (req, res) => {});

//get pattern by :id options {whattoinclude: 0 || 1}
router.get('/:collection/patterns/:id', async (req, res) => {});

//get all pattern names options: {includedescriptions: 0 || 1}
router.get('/:collection/titles', async (req, res) => {});

//find pattern by title
router.get('/:collection/:title', async (req, res) => {});

//find pattern by author
router.get('/:collection/:author', async (req, res) => {});

module.exports = router;
