import express from 'express';
import healthRouter from './health';
import picturesRouter from './pictures';
import moviesRouter from './movies';
import swaggerUi from 'swagger-ui-express';
import openAPiSchema from '../open-api/open-api-schema.json';

const routes = express.Router();

// routes
routes.use(swaggerUi.serve);
routes.use(healthRouter);
routes.use(picturesRouter);
routes.use(moviesRouter);

// Serves open api doc on root
routes.route('/').get(swaggerUi.setup(openAPiSchema));
export default routes;
