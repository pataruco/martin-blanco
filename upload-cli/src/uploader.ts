import { ExifParserFactory } from 'ts-exif-parser';
import { getFilesBy } from 'shared/storage';
import { promises as fs } from 'fs';
import { Storage } from '@google-cloud/storage';
import dotenv from 'dotenv';
import path from 'path';
import sharp from 'sharp';
import chalk from 'chalk';
import { log } from './index';

dotenv.config();

const { BUCKET_NAME } = process.env;
const DELAY_TIME = 100;

interface OriginalTime {
  year: number;
  month: number;
  day: number;
}

interface UploadFilePath extends OriginalTime {
  fileExtension: string;
}

const storage = new Storage();

const getFilesByPath = async (path: string): Promise<string[]> => {
  try {
    return await fs.readdir(path);
  } catch (e) {
    console.error(e);
    throw Error(`Unable to get files from ${path}. ${e}`);
  }
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

const getFilePath = ({
  source,
  file,
}: {
  source: string;
  file: string;
}): string => path.resolve(source, file);

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

const main = async ({ source, target }: UploaderIO): Promise<void> => {
  // TODO: set Google Creds for source
  console.log({ target });
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
