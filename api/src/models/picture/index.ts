// eslint-disable-next-line no-unused-vars
import { Storage, File } from '@google-cloud/storage';
import dotenv from 'dotenv';

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

export const getNumberString = (number: number): string =>
  number < 10 ? String(`0${number}`) : String(number);
