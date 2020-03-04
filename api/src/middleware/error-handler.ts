// eslint-disable-next-line no-unused-vars
import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

const errorHandlerMiddleware = async (
  error: Error,
  _req: Request,
  res: Response,
  // eslint-disable-next-line no-unused-vars
  _next: NextFunction,
) => {
  const { message: errorMessage } = error;
  logger.error(errorMessage);
  return res.status(500).send(errorMessage);
};

export default errorHandlerMiddleware;
