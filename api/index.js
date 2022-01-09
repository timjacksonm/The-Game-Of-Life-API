const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  //request all templates
  res.send('Get route for / not implented.');
});

router.get('/:id', (req, res) => {
  //request template by id
  res.send('Get route for /:id not implented.');
});

router.post('/:id', (req, res) => {
  //save template
  res.send('Post route for /:id not implented.');
});

module.exports = router;
