import express, { Request, Response } from 'express';
import Joi from '@hapi/joi';
import { getFileById, getRandomFile, getFilesBy } from '../../models/movie';

const router = express.Router();

const getMoviesByYearSchema = Joi.object({
  year: Joi.number()
    .integer()
    .min(2017)
    .max(new Date().getFullYear())
    .required(),
});

const getMoviesByYear = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const { error } = getMoviesByYearSchema.validate(req.params);

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

const getMoviesByMonthSchema = getMoviesByYearSchema.keys({
  month: Joi.number()
    .integer()
    .greater(0)
    .less(13)
    .required(),
});

const getMoviesByMonth = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const { error } = getMoviesByMonthSchema.validate(req.params);

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
      month,
      message: 'Files not found',
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error getMoviesByMonth, Error: ${error}`,
    });
  }
};

const getMoviesByDaySchema = getMoviesByMonthSchema.keys({
  day: Joi.number()
    .integer()
    .greater(0)
    .less(32)
    .required(),
});

const getMoviesByDay = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const { error } = getMoviesByDaySchema.validate(req.params);

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
      month,
      day,
      message: 'Files not found',
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error getMoviesByDay, Error: ${error}`,
    });
  }
};

const getMovieByIdSchema = getMoviesByDaySchema.keys({
  id: Joi.number()
    .integer()
    .greater(0)
    .required(),
});

const getMovieById = async (req: Request, res: Response): Promise<Response> => {
  const { error } = getMovieByIdSchema.validate(req.params);

  if (error) {
    return res.status(422).json({
      message: error.details.map(x => x.message).join(', '),
    });
  }

  const { year, month, day, id } = req.params;

  try {
    const file = await getFileById({ year, month, day, id });

    if (file && (await file.exists())) {
      const [downdloadedFile] = await file.download();
      res.set({
        'Content-Type': 'video/webm',
        'Content-Disposition': 'inline',
      });
      return res.send(downdloadedFile);
    } else {
      return res.status(404).json({
        year,
        month,
        day,
        id,
        message: 'File not found',
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: `Error getMovieById, Error: ${error}`,
    });
  }
};

const getRandomMovie = async (
  _req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const file = await getRandomFile();

    if (file && (await file.exists())) {
      const [downdloadedFile] = await file.download();
      res.set({
        'Content-Type': 'video/webm',
        'Content-Disposition': 'inline',
      });
      return res.status(200).send(downdloadedFile);
    } else {
      return res.status(404).json({
        message: 'File not found',
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: `Error getRandomMovie, Error: ${error}`,
    });
  }
};

router.get('/movies/date/:year', getMoviesByYear);
router.get('/movies/date/:year/:month', getMoviesByMonth);
router.get('/movies/date/:year/:month/:day', getMoviesByDay);
router.get('/movies/date/:year/:month/:day/:id', getMovieById);
router.get('/movies/random', getRandomMovie);

export default router;
