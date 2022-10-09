import { NextFunction, Request, Response } from 'express';

interface AppError extends Error {
  statusCode: number;
}

export const errorLogger = (
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(`error ${error.message}`);
  next(error);
};

export const errorResponder = (
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.header('Content-Type', 'application/json');

  const status = error.statusCode || 400;
  res.status(status).send(error.message);
};

export const invalidPathHandler = (req: Request, res: Response) => {
  res.status(404).send('invalid path');
};
