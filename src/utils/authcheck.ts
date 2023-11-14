import { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import ApiKey from '../models/apikey';

dotenv.config();

export const authcheck = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.header('apikey')) {
    res.status(401).json({
      message: 'Invalid request. Must include apikey header',
    });
    return;
  }

  const apikey = await ApiKey.findOne({
    apiKey: req.header('apikey'),
    environment: process.env.NODE_ENV,
    isActive: true,
    $or: [{ expiresAt: null }, { expiresAt: { $gte: new Date() } }],
  });

  if (!apikey) {
    res.status(401).json({
      message: 'Invalid apikey',
    });
    return;
  }

  apikey.usageCount += 1;
  await apikey.save();

  next();
};
