// eslint-disable-next-line no-unused-vars
import express, { Request, Response } from 'express';
import healthRouter from './health';
import picturesRouter from './pictures';

const routes = express.Router();

const baseRoute = async (_req: Request, res: Response) => {
  res.json({
    name: 'Martin Blanco API',
    schemaUrl: 'https://documenter.getpostman.com/view/61112/SzKZsbGy',
  });
};

// routes
routes.use(healthRouter);
routes.use(picturesRouter);

// Serves open api doc on root
routes.route('/').get(baseRoute);
export default routes;
