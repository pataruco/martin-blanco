// eslint-disable-next-line no-unused-vars
import express, { Request, Response } from 'express';
import Joi from '@hapi/joi';
import {
  getFilesBy,
  getFileById,
  getRandomFile,
  getStoragePaths,
} from '../../models/picture';

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

const getPictureByIdSchema = getPicturesByDaySchema.keys({
  id: Joi.number()
    .integer()
    .greater(0)
    .required(),
});

const getPictureById = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const { error } = getPictureByIdSchema.validate(req.params);

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
      res.set('content-type', 'image/jpeg');
      return res.send(downdloadedFile);
    } else {
      return res.status(404).json({
        message: 'File not found',
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: `Error getPictureById, Error: ${error}`,
    });
  }
};

const getRandomPicture = async (
  _req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const file = await getRandomFile();

    if (file && (await file.exists())) {
      const [downdloadedFile] = await file.download();
      res.set('content-type', 'image/jpeg');
      return res.send(downdloadedFile);
    } else {
      return res.status(404).json({
        message: 'File not found',
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: `Error getRandomPicture, Error: ${error}`,
    });
  }
};

const uploadPictures = async (req: Request, res: Response) => {
  try {
    const { files } = await req;
    // @ts-ignore
    const filesBuffer: Buffer[] = files.map(
      (file: Express.Multer.File) => file.buffer,
    );

    const storagePaths = await getStoragePaths(filesBuffer);

    console.log({ storagePaths });

    return res.status(201).json({
      filesUploaded: storagePaths,
    });
  } catch (error) {
    return res.status(409).json({
      message: `Error uploadPictures, Error: ${error}`,
    });
  }
};

router.get('/pictures/date/:year', getPicturesByYear);
router.get('/pictures/date/:year/:month', getPicturesByMonth);
router.get('/pictures/date/:year/:month/:day', getPicturesByDay);
router.get('/pictures/date/:year/:month/:day/:id', getPictureById);
router.get('/pictures/random', getRandomPicture);
router.post('/pictures', uploadPictures);

export default router;
