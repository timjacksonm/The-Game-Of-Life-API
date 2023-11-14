import express from 'express';
import wiki from './wiki';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Welcome to The Game Of Life API!' });
});

wiki(router);

export default router;
