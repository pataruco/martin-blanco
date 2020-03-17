// eslint-disable-next-line no-unused-vars
import express, { Request, Response } from 'express';
import healthRouter from './health';
import picturesRouter from './pictures';
import swaggerUi from 'swagger-ui-express';
import openAPiSchema from '../open-api/open-api-schema.json';

const routes = express.Router();

// routes
routes.use(swaggerUi.serve);
routes.use(healthRouter);
routes.use(picturesRouter);

// Serves open api doc on root
routes.route('/').get(swaggerUi.setup(openAPiSchema));
export default routes;
