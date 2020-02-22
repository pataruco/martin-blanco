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

const bucket = storage.bucket('martin-blanco');

const getFilesByYear = async (year: string) => {
  bucket.getFiles(
    {
      autoPaginate: false,
      directory: `pictures/${year}`,
    },
    (error, files) => {
      if (error) {
        console.error(error);
        throw Error(`Failing get files from ${year}, Error: ${error}`);
      }
      console.log({ files });
      return files;
    },
  );
};

const start = async () => {
  const files = await getFilesByYear('2017');

  console.log({ BUCKET_NAME, files });
};

start();
