import { NextFunction, Request, Response } from 'express';
import debug from 'debug';

const info = debug('app:info');
info.log = console.info.bind(console);
const error = debug('app:error');
error.log = console.error.bind(console);
const logger = debug('app:log');
logger.log = console.log.bind(console);

interface AppError extends Error {
  statusCode: number;
}

export const errorLogger = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const msg = `error ${err.message}`;
  error(msg);
  next(error);
};

export const errorResponder = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.header('Content-Type', 'application/json');

  const status = err.statusCode || 400;
  res.status(status).send(err.message);
};

export const invalidPathHandler = (req: Request, res: Response) => {
  error(`404: invalid path ${req.path}`);
  res.status(404).send('invalid path');
};

export { info, error, logger };
