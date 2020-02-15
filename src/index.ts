/* eslint-disable no-unused-vars */
import express, { Request, Response, NextFunction } from 'express';
import errorHandlerMiddleware from './middleware/error-handler';
import httpLoggerMiddleware from './middleware/http-logger';
import logger from './utils/logger';

export const PORT = process.env.PORT || '8080';
export const HOST = process.env.HOST || '0.0.0.0';

export const app = express();

app.use(httpLoggerMiddleware);
app.use(errorHandlerMiddleware);

app.get('/health', async (req: Request, res: Response, next: NextFunction) => {
  res.send('OK');
});

if (!module.parent) {
  app.listen(PORT, () =>
    logger.info(`server.listening ${JSON.stringify({ HOST, PORT })}`),
  );
}
