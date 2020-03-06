/* eslint-disable no-unused-vars */
import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

const httpLoggerMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { method, url, hostname, body } = req;
  const { statusCode, statusMessage } = res;
  logger.info({ req: { method, url, hostname, body } });
  logger.info({ res: { url, statusCode, statusMessage } });
  next();
};

export default httpLoggerMiddleware;
