import debug from 'debug';
import express, { Request, Response } from 'express';
const router = express.Router();
export const logError = debug('routes:error');
logError.log = console.error.bind(console);

router.get('/', async (req: Request, res: Response) => {
  res.json({ message: 'Welcome to The Game Of Life API!' });
});

export default router;
