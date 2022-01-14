const express = require('express');
const router = express.Router();
const WikiTemplate = require('../models/template');
const template_controller = require('../controllers/officialTemplateController');

//get all pattern names options: {includedescriptions: 0 || 1}
router.get('/:collection/titles', async (req, res) => {});

//find pattern by title
router.get('/:collection/:title', async (req, res) => {});

//find pattern by author
router.get('/:collection/:author', async (req, res) => {});

//get random patterns options: {howmany: num}
router.get('/:collection/patterns', async (req, res) => {});

//get random pattern
router.get('/:collection/pattern', async (req, res) => {});

//get pattern by :id options {whattoinclude: 0 || 1}
router.get('/:collection/pattern/:id', async (req, res) => {});

module.exports = router;
