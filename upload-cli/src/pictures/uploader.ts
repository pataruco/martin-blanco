import { ExifParserFactory } from 'ts-exif-parser';
import { log } from './index';
import { promises as fs } from 'fs';
import { Storage } from '@google-cloud/storage';
import chalk from 'chalk';
import dotenv from 'dotenv';
import path from 'path';
import sharp from 'sharp';
// eslint-disable-next-line no-unused-vars
import {
  getFilesByPath,
  getFilePath,
  // eslint-disable-next-line no-unused-vars
  OriginalTime,
  // eslint-disable-next-line no-unused-vars
  Time,
  // eslint-disable-next-line no-unused-vars
  UploadFilePath,
} from '../lib/uploader';

dotenv.config();

let BUCKET_NAME: string;
const {
  BUCKET_NAME_DEV,
  BUCKET_NAME_PROD,
  GOOGLE_CREDENTIALS_DEV,
  GOOGLE_CREDENTIALS_PROD,
} = process.env;
const DELAY_TIME = 100;

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
  const storage = new Storage();
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

const getfile = async (path: string): Promise<Buffer> => {
  try {
    return await fs.readFile(path);
  } catch (e) {
    console.error(e);
    throw Error(`Unable to get file from ${path}. ${e}`);
  }
};

const getRotatedAndResizeBuffer = async (buffer: Buffer) =>
  await sharp(buffer)
    .rotate()
    .resize(800)
    .toBuffer();

const getOriginalTime = async (buffer: Buffer): Promise<OriginalTime> => {
  const data = await ExifParserFactory.create(buffer).parse();
  const originalTime =
    data.tags?.DateTimeOriginal ?? new Date(0).getUTCSeconds();
  const date = new Date(new Date(0).setUTCSeconds(originalTime));
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
  };
};

const getFileExtension = (filePath: string): string => path.extname(filePath);

const getNumberString = (number: number): string =>
  number < 10 ? String(`0${number}`) : String(number);

const getUploadFilePath = async (fileTime: UploadFilePath): Promise<string> => {
  const { year, month, day, fileExtension } = fileTime;
  const yearString = getNumberString(year);
  const monthString = getNumberString(month);
  const dayString = getNumberString(day);

  const files = await getFilesBy({
    year: yearString,
    month: monthString,
    day: dayString,
  });

  const fileNumber = files.length > 0 ? files.length + 1 : 1;

  return `pictures/${yearString}/${monthString}/${dayString}/${fileNumber}${fileExtension}`;
};

const delay = (ms: number): Promise<NodeJS.Timeout> =>
  new Promise(resolve => setTimeout(resolve, ms));

const uploadFile = async ({
  fileName,
  buffer,
}: {
  fileName: string;
  buffer: Buffer;
}): Promise<string> => {
  const storage = new Storage();
  const bucket = await storage.bucket(`${BUCKET_NAME}`);
  const file = await bucket.file(fileName);
  try {
    await file.save(buffer);
    return `https://storage.googleapis.com/${BUCKET_NAME}/${fileName}`;
  } catch (error) {
    console.error(`File ${fileName} failed to save in storage, ${error}`);
    throw Error(error);
  }
};

interface UploaderIO {
  source: string;
  target: 'development' | 'production';
}

const setEnvironment = async (target: UploaderIO['target']): Promise<void> =>
  new Promise(resolve => {
    if (target === 'development') {
      BUCKET_NAME = BUCKET_NAME_DEV ?? '';
      process.env = {
        ...process.env,
        GOOGLE_APPLICATION_CREDENTIALS: GOOGLE_CREDENTIALS_DEV,
      };
    }

    if (target === 'production') {
      BUCKET_NAME = BUCKET_NAME_PROD ?? '';
      process.env = {
        ...process.env,
        GOOGLE_APPLICATION_CREDENTIALS: GOOGLE_CREDENTIALS_PROD,
      };
    }
    resolve();
  });

const main = async ({ source, target }: UploaderIO): Promise<void> => {
  await setEnvironment(target);

  try {
    log(chalk`Get files from: {green ${source}}`);

    const filesPath = await getFilesByPath(source);
    const total = filesPath.length;
    let counter = 1;

    for (const file of filesPath) {
      log(chalk`{inverse ${counter} of ${total}}`);

      const filePath = getFilePath({ file, source });
      const fileExtension = getFileExtension(filePath);

      // get file
      log(chalk`Get file from: {yellow ${filePath}}`);
      const buffer = await getfile(filePath);

      // rotate and resize
      log(chalk`Resizing and rotating image: {blue ${filePath}} 📷`);
      const rotatedAndResizeBuffer = await getRotatedAndResizeBuffer(buffer);

      // create path format
      const { year, month, day } = await getOriginalTime(buffer);

      // create upload file path
      const uploadFilePath = await getUploadFilePath({
        year,
        month,
        day,
        fileExtension,
      });
      log(chalk`Get target {magenta ${uploadFilePath}} for image ${filePath}`);

      // upload file
      log(chalk`{bgYellow {black Delaying for ${DELAY_TIME}ms}}`);
      await delay(DELAY_TIME);
      await uploadFile({
        fileName: uploadFilePath,
        buffer: rotatedAndResizeBuffer,
      });
      log(
        chalk`{bold File ${uploadFilePath} uploaded to ${uploadFilePath}} 💥`,
      );
      counter++;
    }
  } catch (e) {
    console.error(e);
    throw Error(`Error processing upload. ${e}`);
  }
};

export default main;
