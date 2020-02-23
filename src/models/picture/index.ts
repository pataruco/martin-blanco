import { Storage } from '@google-cloud/storage';
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
