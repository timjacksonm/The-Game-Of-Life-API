import { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
dotenv.config();

export const auth = (req: Request, res: Response, next: NextFunction) => {
  const { RAPID_API_KEY } = process.env;
  if (!req.header('X-RapidAPI-Proxy-Secret')) {
    return res.status(401).json({
      message: 'Invalid request. Must include X-RapidAPI-Proxy-Secret Header',
    });
  }

  if (req.header('X-RapidAPI-Proxy-Secret') !== RAPID_API_KEY) {
    return res.status(401).json({ message: 'Invalid API Key' });
  }

  next();
};
