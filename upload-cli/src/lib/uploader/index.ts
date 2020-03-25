import { promises as fs } from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

export interface OriginalTime {
  year: number;
  month: number;
  day: number;
}

export interface Time {
  year: string;
  month?: string;
  day?: string;
}

export interface UploaderIO {
  source: string;
  target: 'development' | 'production';
}

export interface UploadFilePath extends OriginalTime {
  fileExtension?: string;
}

const {
  BUCKET_NAME_DEV,
  BUCKET_NAME_PROD,
  GOOGLE_CREDENTIALS_DEV,
  GOOGLE_CREDENTIALS_PROD,
} = process.env;

export let BUCKET_NAME: string;

export const DELAY_TIME = 100;

export const getFilesByPath = async (path: string): Promise<string[]> => {
  try {
    return await fs.readdir(path);
  } catch (e) {
    console.error(e);
    throw Error(`Unable to get files from ${path}. ${e}`);
  }
};

export const setEnvironment = async (
  target: UploaderIO['target'],
): Promise<void> =>
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

export const getFilePath = ({
  source,
  file,
}: {
  source: string;
  file: string;
}): string => path.resolve(source, file);

export const delay = (ms: number): Promise<NodeJS.Timeout> =>
  new Promise(resolve => setTimeout(resolve, ms));
