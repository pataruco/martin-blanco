import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

const httpLoggerMiddleware = async (
  req: Request,
  _res: Response,
  done: NextFunction,
) => {
  const { method, url, hostname, body } = req;
  logger.info({ method, url, hostname, body });
  done();
};

export default httpLoggerMiddleware;
