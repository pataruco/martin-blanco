import express from 'express';
import healthRouter from './health';
import picturesRouter from './pictures';

const routes = express.Router();

routes.use('/', healthRouter);
routes.use('/', picturesRouter);

export default routes;
