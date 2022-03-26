const express = require('express');
const router = express.Router();
const debug = require('debug')('startup:api');
const { decode } = require('rle-decoder');
const WikiTemplates = require('../models/wikitemplate');
const CustomTemplates = require('../models/customtemplate');
const { validateAndSanitize } = require('./validateandsanitize');
const { validationResult } = require('express-validator');

router.get('/', async (req, res) => {
  res.json({ message: 'Welcome to The Game Of Life API!' });
});

//**GET** patterns from wikicollection sorted small -> large -- options { select: JSON Array, count: num }
router.get(
  '/wikicollection/patterns/',
  validateAndSanitize('list'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      debug('%j', errors);
      return res.status(400).json({ message: errors });
    }
    try {
      const count =
        Number(req.query.count) ||
        (await WikiTemplates.estimatedDocumentCount());
      //throw is set for object if there is no selection in query. aggregate doesn't take an array of strings like findByID does for projection :(
      let projection = { throw: 0 };
      if (req.query.select) {
        //create object of array { field: 1 }
        projection = JSON.parse(req.query.select).reduce(
          (acc, curr) => ((acc[curr] = 1), acc),
          {}
        );
      }

      const response = await WikiTemplates.aggregate([
        { $sample: { size: count } },
        { $sort: { 'size.x': 1, 'size.y': 1 } },
        { $project: projection },
      ]);
      res.status(200).json(response);
    } catch (err) {
      debug(err);
      res.status(500).json({ message: err });
    }
  }
);

//**GET** patterns from customcollection sorted small -> large -- options { select: JSON Array, count: num }
router.get(
  '/customcollection/patterns/',
  validateAndSanitize('list'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      debug('%j', errors);
      return res.status(400).json({ message: errors });
    }
    try {
      const count =
        Number(req.query.count) ||
        (await CustomTemplates.estimatedDocumentCount());
      let projection = { throw: 0 };
      if (req.query.select) {
        //create object of array { field: 1 }
        projection = JSON.parse(req.query.select).reduce(
          (acc, curr) => ((acc[curr] = 1), acc),
          {}
        );
      }

      const response = await CustomTemplates.aggregate([
        { $sample: { size: count } },
        { $sort: { 'size.x': 1, 'size.y': 1 } },
        { $project: projection },
      ]);
      res.status(200).json(response);
    } catch (err) {
      debug(err);
      res.status(500).json({ message: err });
    }
  }
);

//**GET** wikicollection pattern by :id -- options { select: JSON Array }
router.get(
  '/wikicollection/patterns/:id/:select?',
  validateAndSanitize('byid'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      debug('%j', errors);
      return res.status(400).json({ message: errors });
    }
    try {
      const projection = req.query.select ? JSON.parse(req.query.select) : '';
      const response = await WikiTemplates.findById(req.params.id, projection);
      response._doc.rleString = decode(
        response._doc.rleString,
        response._doc.size
      );
      res.status(200).json(response);
    } catch (err) {
      debug(err);
      res.status(500).json({ message: err });
    }
  }
);

//**GET** customcollection pattern by :id -- options { select: JSON Array }
router.get(
  '/customcollection/patterns/:id/:select?',
  validateAndSanitize('byid'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      debug('%j', errors);
      return res.status(400).json({ message: errors });
    }
    try {
      const projection = req.query.select ? JSON.parse(req.query.select) : '';
      const response = await CustomTemplates.findById(
        req.params.id,
        projection
      );
      response._doc.rleString = decode(
        response._doc.rleString,
        response._doc.size
      );
      res.status(200).json(response);
    } catch (err) {
      debug(err);
      res.status(500).json({ message: err });
    }
  }
);

//**GET** all wikicollection patterns by search -- options { select: JSON Array, count: num }
router.get(
  '/wikicollection/search/:path/:value?/:select?',
  validateAndSanitize('bysearch'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      debug('%j', errors);
      return res.status(400).json({ message: errors });
    }
    if (!req.query.value) {
      return res.status(400).json({ message: 'Invalid search parameters' });
    }
    try {
      const count =
        Number(req.query.count) ||
        (await WikiTemplates.estimatedDocumentCount());
      let projection = { throw: 0 };
      if (req.query.select) {
        //create object of array { field: 1 }
        projection = JSON.parse(req.query.select).reduce(
          (acc, curr) => ((acc[curr] = 1), acc),
          {}
        );
      }

      const response = await WikiTemplates.aggregate([
        {
          $search: {
            index: 'custom',
            text: {
              query: req.query.value,
              path: req.params.path,
            },
          },
        },
        { $project: projection },
        { $sample: { size: count } },
      ]);
      res.status(200).json(response);
    } catch (err) {
      debug(err);
      res.status(500).json({ message: err });
    }
  }
);

//**Post** save new pattern to CustomTemplates in db
router.post(
  '/customcollection/patterns/',
  validateAndSanitize('create'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      debug('%j', errors);
      return res.status(400).json({ message: errors });
    }
    try {
      const { author, title, description, size, rleString } = req.body;
      const pattern = await CustomTemplates.create({
        author,
        title,
        description,
        size,
        rleString,
      });
      res.status(201).json(pattern);
    } catch (err) {
      debug(err);
      res.status(500).json({ message: err });
    }
  }
);

//**Post** delete a pattern in CustomTemplates db
router.delete('/customcollection/patterns/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const found = await CustomTemplates.findById({ _id: id });
    if (!found) {
      res.status(404).json({ message: 'Pattern id not found.' });
    } else {
      const response = await CustomTemplates.findByIdAndDelete({
        _id: id,
      });
      res.status(200).json(response._doc);
    }
  } catch (err) {
    debug(err);
    res.status(500).json({ message: err });
  }
});
module.exports = router;
