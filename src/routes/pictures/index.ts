// eslint-disable-next-line no-unused-vars
import express, { Request, Response } from 'express';

const router = express.Router();

const getPicturesByYear = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const { year } = req.params;
  return res.send(year);
};

router.get('/pictures/year/:year', getPicturesByYear);

export default router;
