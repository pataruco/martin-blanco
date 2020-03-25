import express, { Request, Response } from 'express';

const healthRouter = express.Router();

export const getHealth = async (_req: Request, res: Response) => res.send('OK');

healthRouter.get('/health', getHealth);

export default healthRouter;
