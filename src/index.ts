/* eslint-disable no-unused-vars */
import express from 'express';
import errorHandlerMiddleware from './middleware/error-handler';
import httpLoggerMiddleware from './middleware/http-logger';
import fileUploadMiddleware from './middleware/file-uploads';

import logger from './utils/logger';
import router from './routes';

export const PORT = process.env.PORT || '8080';
export const HOST = process.env.HOST || '0.0.0.0';

export const app = express();

app.use(httpLoggerMiddleware);
app.use(fileUploadMiddleware.array('files'));
app.use(errorHandlerMiddleware);

// Routes
app.use(router);

if (!module.parent) {
  app.listen(PORT, () =>
    logger.info(`server.listening ${JSON.stringify({ HOST, PORT })}`),
  );
}
