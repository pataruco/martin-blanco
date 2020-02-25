// eslint-disable-next-line no-unused-vars
import express, { Request, Response } from 'express';
import healthRouter from './health';
import picturesRouter from './pictures';
import path from 'path';

const routes = express.Router();

const openApiHTmlFile = path.resolve(__dirname, '..', 'open-api', 'index.html');

console.log({ openApiHTmlFile });

routes.use('/', healthRouter);
routes.use('/', picturesRouter);

routes.use('/', async (_req: Request, res: Response) => {
  res.set({
    'Content-Type': 'text/html; charset=UTF-8',
  });
  res.sendFile(openApiHTmlFile);
});

export default routes;
