// eslint-disable-next-line no-unused-vars
import multer, { FileFilterCallback } from 'multer';
// eslint-disable-next-line no-unused-vars
import { Request } from 'express';

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  callback: FileFilterCallback,
): void => {
  const { mimetype } = file;

  mimetype.includes('image')
    ? callback(null, true)
    : callback(new Error('File mimetype is not image.'));
};

const multerMiddleware: any = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 7 * 1024 * 1024, // 7 MB
    files: 10,
  },
  fileFilter,
});

export default multerMiddleware;
