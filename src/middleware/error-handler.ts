import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

const errorHandlerMiddleware = async (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { message: errorMessage } = error;
  logger.error(errorMessage);
  return res.status(500).send(errorMessage);
};

export default errorHandlerMiddleware;
