// eslint-disable-next-line no-unused-vars
import express, { Request, Response } from 'express';
import Joi from '@hapi/joi';
import { getFilesBy } from '../../models/picture';

const router = express.Router();

const getPicturesByYearSchema = Joi.object({
  year: Joi.number()
    .integer()
    .min(2017)
    .max(new Date().getFullYear()),
});

const getPicturesByYear = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const { year } = req.params;

  const { error } = getPicturesByYearSchema.validate(req.params);

  if (error) {
    return res.status(422).json({
      message: error.details.map(x => x.message).join(', '),
    });
  }

  try {
    const files = await getFilesBy({ year });
    if (files.length > 0) {
      return res.json({
        year,
        files,
      });
    }
    return res.status(404).json({
      year,
      message: 'Files not found',
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error getFilesByYear, Error: ${error}`,
    });
  }
};

router.get('/pictures/year/:year', getPicturesByYear);

export default router;
