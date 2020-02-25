// eslint-disable-next-line no-unused-vars
import express, { Request, Response } from 'express';
import Joi from '@hapi/joi';
import { getFilesBy } from '../../models/picture';

const router = express.Router();

const getPicturesByYearSchema = Joi.object({
  year: Joi.number()
    .integer()
    .min(2017)
    .max(new Date().getFullYear())
    .required(),
});

const getPicturesByYear = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const { error } = getPicturesByYearSchema.validate(req.params);

  if (error) {
    return res.status(422).json({
      message: error.details.map(x => x.message).join(', '),
    });
  }

  const { year } = req.params;

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

const getPicturesByMonthSchema = getPicturesByYearSchema.keys({
  month: Joi.number()
    .integer()
    .greater(0)
    .less(13)
    .required(),
});

const getPicturesByMonth = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const { error } = getPicturesByMonthSchema.validate(req.params);

  if (error) {
    return res.status(422).json({
      message: error.details.map(x => x.message).join(', '),
    });
  }

  const { year, month } = req.params;

  try {
    const files = await getFilesBy({ year, month });
    if (files.length > 0) {
      return res.json({
        year,
        month,
        files,
      });
    }
    return res.status(404).json({
      year,
      message: 'Files not found',
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error getPicturesByMonth, Error: ${error}`,
    });
  }
};

const getPicturesByDaySchema = getPicturesByMonthSchema.keys({
  day: Joi.number()
    .integer()
    .greater(0)
    .less(32)
    .required(),
});

const getPicturesByDay = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const { error } = getPicturesByDaySchema.validate(req.params);

  if (error) {
    return res.status(422).json({
      message: error.details.map(x => x.message).join(', '),
    });
  }

  const { year, month, day } = req.params;

  try {
    const files = await getFilesBy({ year, month, day });
    if (files.length > 0) {
      return res.json({
        year,
        month,
        day,
        files,
      });
    }
    return res.status(404).json({
      year,
      message: 'Files not found',
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error getPicturesByDay, Error: ${error}`,
    });
  }
};

router.get('/pictures/date/:year', getPicturesByYear);
router.get('/pictures/date/:year/:month', getPicturesByMonth);
router.get('/pictures/date/:year/:month/:day', getPicturesByDay);
// router.get('/pictures/date/:year/:month/:day/:id', getPicturesByDay);

export default router;
