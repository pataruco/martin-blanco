import { Storage } from '@google-cloud/storage';
import dotenv from 'dotenv';

dotenv.config();

const {
  PROJECT_ID: projectId,
  KEY_FILENAME: keyFilename,
  BUCKET_NAME,
} = process.env;

const storage = new Storage({
  projectId,
  keyFilename: '/Users/pataruco/creds/martin-blanco-api-dev.json',
});

const getSpiredDate = (): Date => {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  return date;
};

const getFilesByYear = async (year: string) => {
  const [allFiles] = await storage.bucket(`${BUCKET_NAME}`).getFiles({
    autoPaginate: false,
    directory: `pictures/${year}`,
  });

  return await Promise.all(
    await allFiles
      .filter(file => file.name.includes('.'))
      .map(async file => {
        const url = await file.getSignedUrl({
          action: 'read',
          expires: getSpiredDate(),
        });
        return url;
      }),
  );
};

const start = async () => {
  const files = await getFilesByYear('2017');
  console.log({ files });
};

start();
