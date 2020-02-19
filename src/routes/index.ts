import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json';
import express from 'express';
import healthRouter from './health';

const routes = express.Router();

routes.use('/', healthRouter);
routes.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export default routes;
