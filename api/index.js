const express = require('express');
const router = express.Router();
const template_controller = require('../controllers/officialTemplateController');

router.get('/', (req, res) => {
  //request all templates
  res.send('Get route for / not implented.');
});

router.get('/:id', (req, res) => {
  //request template by id
  res.send('Get route for /:id not implented.');
});

router.post('/:id', template_controller.post_create_new);

module.exports = router;
