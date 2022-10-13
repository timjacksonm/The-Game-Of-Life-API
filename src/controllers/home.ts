import express, { Request, Response } from 'express';
const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  res.json({ message: 'Welcome to The Game Of Life API!' });
});

export default router;
