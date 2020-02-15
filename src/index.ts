import express, { Request, Response, NextFunction } from 'express';
import logger, { myStream } from './logger';
import morgan from 'morgan';

export const PORT = process.env.PORT || '8080';
export const HOST = process.env.HOST || '0.0.0.0';
export const app = express();

const errorHandlerMiddleware = async (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { message: errorMessage } = error;
  console.log(errorMessage);
  return res.status(500).send(errorMessage);
};

app.get('/health', async (req, res, next) => {
  res.send('OK');
});

app.use(errorHandlerMiddleware);
app.use(morgan('combined', { stream: myStream }));

if (!module.parent) {
  app.listen(PORT, () => console.log('server.listening', { HOST, PORT }));
}
