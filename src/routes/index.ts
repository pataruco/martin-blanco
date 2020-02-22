import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json';
import express from 'express';
import healthRouter from './health';
import picturesRouter from './pictures';

const routes = express.Router();

routes.use('/', healthRouter);
routes.use('/', picturesRouter);
routes.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export default routes;
