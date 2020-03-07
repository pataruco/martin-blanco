import { ExifParserFactory } from 'ts-exif-parser';
import { promises as fs } from 'fs';
import { Storage } from '@google-cloud/storage';
import dotenv from 'dotenv';
import path from 'path';
import sharp from 'sharp';

dotenv.config();

const { BUCKET_NAME } = process.env;

interface OriginalTime {
  year: number;
  month: number;
  day: number;
}

interface UploadFilePath extends OriginalTime {
  fileExtension: string;
}

// TODO: move this to shared lib
export interface Time {
  year: string;
  month?: string;
  day?: string;
}

const storage = new Storage();

const filesOnDesktop = path.resolve('../../../Desktop/test-files');

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

const getFilePath = (file: string): string =>
  // FIXME: filesOnDesktop is hardcoded
  path.resolve(filesOnDesktop, file);

const getFileExtension = (filePath: string): string => path.extname(filePath);

const getNumberString = (number: number): string =>
  number < 10 ? String(`0${number}`) : String(number);

// TODO: move this to shared lib
const getDirectory = (query: Time) => {
  const { year, month, day } = query;
  return day
    ? `pictures/${year}/${month}/${day}`
    : month
    ? `pictures/${year}/${month}`
    : `pictures/${year}`;
};

// TODO: move this to shared lib
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
    console.log(`File ${fileName} saved in storage`);
    return `https://storage.googleapis.com/${BUCKET_NAME}/${fileName}`;
  } catch (error) {
    console.error(`File ${fileName} failed to save in storage, ${error}`);
    throw Error(error);
  }
};

const start = async () => {
  try {
    const filesPath = await getFilesByPath(filesOnDesktop);
    for (const file of filesPath) {
      const filePath = getFilePath(file);
      const fileExtension = getFileExtension(filePath);
      // get file
      const buffer = await getfile(filePath);
      // rotate and resize
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
      // upload file
      await delay(100);
      await uploadFile({
        fileName: uploadFilePath,
        buffer: rotatedAndResizeBuffer,
      });
    }
  } catch (e) {
    console.error(e);
  }
};

if (!module.parent) {
  start().then();
}
