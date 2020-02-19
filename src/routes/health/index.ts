// eslint-disable-next-line no-unused-vars
import express, { Request, Response } from 'express';

const healthRouter = express.Router();

healthRouter.get('/health', async (req: Request, res: Response) => {
  res.send('OK');
});

export default healthRouter;
