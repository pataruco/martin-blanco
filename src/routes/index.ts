// eslint-disable-next-line no-unused-vars
import express, { Request, Response } from 'express';
import healthRouter from './health';
import picturesRouter from './pictures';
import path from 'path';

const routes = express.Router();

const openApiHTmlFile = path.resolve(__dirname, '..', 'open-api', 'index.html');

const openApiRoute = async (_req: Request, res: Response) => {
  res.set({
    'Content-Type': 'text/html; charset=UTF-8',
  });
  res.sendFile(openApiHTmlFile);
};

// routes
routes.use(healthRouter);
routes.use(picturesRouter);

// Serves open api doc on root
routes.route('/').get(openApiRoute);
export default routes;
