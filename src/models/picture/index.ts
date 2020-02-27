import { Storage, File } from '@google-cloud/storage';
import dotenv from 'dotenv';

dotenv.config();

const { PROJECT_ID: projectId, BUCKET_NAME } = process.env;

const storage = new Storage({
  projectId,
});

export interface Time {
  year: string;
  month?: string;
  day?: string;
}

interface TimeAndId extends Time {
  id: string;
}

const getDirectory = (query: Time) => {
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

export const getFileById = async (
  query: TimeAndId,
): Promise<File | undefined> => {
  const { year, month, day, id } = query;

  if (year && month && day && id) {
    return await storage
      .bucket(`${BUCKET_NAME}`)
      .file(`pictures/${year}/${month}/${day}/${id}.jpeg`);
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
