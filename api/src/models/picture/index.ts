// eslint-disable-next-line no-unused-vars
import { Storage, File } from '@google-cloud/storage';
import dotenv from 'dotenv';
import { ExifParserFactory } from 'ts-exif-parser';
import sharp from 'sharp';
import logger from '../../utils/logger';

dotenv.config();

interface OriginalTime {
  year: number;
  month: number;
  day: number;
}

export interface Time {
  year: string;
  month?: string;
  day?: string;
}

export const getDirectory = (query: Time) => {
  const { year, month, day } = query;
  return day
    ? `pictures/${year}/${month}/${day}`
    : month
    ? `pictures/${year}/${month}`
    : `pictures/${year}`;
};

export const getFilesBy = async (query: Time) => {
  const directory = getDirectory(query);

  const [allFiles] = await storage.bucket(`${BUCKET_NAME}`).getFiles({
    autoPaginate: false,
    directory,
  });

  return await Promise.all(
    allFiles
      .filter(file => file.name.includes('.'))
      .map(
        async file =>
          `https://storage.googleapis.com/${BUCKET_NAME}/${file.name}`,
      ),
  );
};

interface BufferToupload extends OriginalTime {
  buffer: Buffer;
  mimetype: string;
}

interface TimeAndId extends Time {
  id: string;
}

const { BUCKET_NAME } = process.env;

const storage = new Storage();

export const getFileById = async (
  query: TimeAndId,
): Promise<File | undefined> => {
  const { year, month, day, id } = query;

  if (year && month && day && id) {
    const filesbyDate = await getFilesBy({ year, month, day });

    const [filename] = filesbyDate.filter(fileByDate =>
      fileByDate.includes(
        `https://storage.googleapis.com/${BUCKET_NAME}/pictures/${year}/${month}/${day}/${id}`,
      ),
    );

    const filepath = filename.split(`${BUCKET_NAME}/`).pop();

    return filepath
      ? storage.bucket(`${BUCKET_NAME}`).file(filepath)
      : undefined;
  }
};

const getRandomIndex = (length: number): number =>
  Math.floor(Math.random() * Math.floor(length));

export const getRandomFile = async (): Promise<File> => {
  const [allFiles] = await storage.bucket(`${BUCKET_NAME}`).getFiles({
    autoPaginate: false,
  });

  const allPictures = allFiles.filter(file => file.name.includes('.'));
  const randomIndex = getRandomIndex(allPictures.length);
  return allPictures[randomIndex];
};

export const getOriginalTime = async (
  buffer: Buffer,
): Promise<OriginalTime> => {
  const data = await ExifParserFactory.create(buffer).parse();
  const originalTime =
    data.tags?.DateTimeOriginal ?? new Date(0).getUTCSeconds();
  const date = new Date(new Date(0).setUTCSeconds(originalTime));
  return {
    year: date.getFullYear(),
    month: date.getMonth(),
    day: date.getDate(),
  };
};

const getRotatedAndResizeBuffer = async (buffer: Buffer): Promise<Buffer> =>
  await sharp(buffer)
    .rotate()
    .resize(800)
    .toBuffer();

export const getNumberString = (number: number): string =>
  number < 10 ? String(`0${number}`) : String(number);

const getFileName = async (bufferToUpload: BufferToupload): Promise<string> => {
  const { year, month, day, mimetype } = bufferToUpload;
  const yearString = getNumberString(year);
  const monthString = getNumberString(month);
  const dayString = getNumberString(day);

  const files = await getFilesBy({
    year: yearString,
    month: monthString,
    day: dayString,
  });

  const fileExtension = mimetype.split('/')[1];
  const fileNumber = files.length > 0 ? files.length + 1 : 1;

  return `pictures/${yearString}/${monthString}/${dayString}/${fileNumber}.${fileExtension}`;
};

const uploadFile = async ({
  fileName,
  buffer,
}: {
  fileName: string;
  buffer: BufferToupload['buffer'];
}): Promise<string> => {
  const bucket = await storage.bucket(`${BUCKET_NAME}`);
  const file = await bucket.file(fileName);

  try {
    await file.save(buffer);
    logger.info(`File ${fileName} saved in storage`);
    return `https://storage.googleapis.com/${BUCKET_NAME}/${fileName}`;
  } catch (error) {
    logger.error(`File ${fileName} failed to save in storage, ${error}`);
    throw Error(error);
  }
};

const uploadToStorage = async (
  buffersToUpload: BufferToupload[],
): Promise<string[]> =>
  await Promise.all(
    buffersToUpload.map(async bufferToUpload => {
      const { buffer } = bufferToUpload;
      const fileName = await getFileName(bufferToUpload);
      const filePath = await uploadFile({ fileName, buffer });
      return filePath;
    }),
  );

export const getStoragePaths = async (
  files: Express.Multer.File[],
): Promise<string[]> => {
  const buffersToUpload = await Promise.all(
    files.map(async file => {
      const { buffer, mimetype } = file;
      const { year, month, day } = await getOriginalTime(buffer);
      return {
        year,
        month,
        day,
        buffer: await getRotatedAndResizeBuffer(buffer),
        mimetype,
      };
    }),
  );

  const paths = await uploadToStorage(buffersToUpload);
  return paths;
};
