import ffmpeg from 'fluent-ffmpeg';
// eslint-disable-next-line no-unused-vars
import { Writable } from 'stream';
import dotenv from 'dotenv';
import { Storage } from '@google-cloud/storage';
import chalk from 'chalk';
import { log } from '../index';

dotenv.config();

const VIDEO_FORMAT = 'webm';

import {
  getFilesByPath,
  getFilePath,
  // eslint-disable-next-line no-unused-vars
  OriginalTime,
  // eslint-disable-next-line no-unused-vars
  Time,
  // eslint-disable-next-line no-unused-vars
  UploadFilePath,
  // eslint-disable-next-line no-unused-vars
  UploaderIO,
  delay,
  DELAY_TIME,
} from '../lib/uploader';

const {
  BUCKET_NAME_DEV,
  BUCKET_NAME_PROD,
  GOOGLE_CREDENTIALS_DEV,
  GOOGLE_CREDENTIALS_PROD,
} = process.env;

dotenv.config();

let BUCKET_NAME: string;

const VIDEO_SIZE = '50%';
const VIDEO_CODEC = 'libvpx';
const VIDEO_BITRATE = '1000k';

const AUDIO_CODEC = 'libvorbis';

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

export const getDirectory = (query: Time) => {
  const { year, month, day } = query;
  return day
    ? `movies/${year}/${month}/${day}`
    : month
    ? `movies/${year}/${month}`
    : `movies/${year}`;
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

const getNumberString = (number: number): string =>
  number < 10 ? String(`0${number}`) : String(number);

const getUploadFilePath = async (fileTime: UploadFilePath): Promise<string> => {
  const { year, month, day, fileExtension = VIDEO_FORMAT } = fileTime;
  const yearString = getNumberString(year);
  const monthString = getNumberString(month);
  const dayString = getNumberString(day);

  const files = await getFilesBy({
    year: yearString,
    month: monthString,
    day: dayString,
  });

  const fileNumber = files.length > 0 ? files.length + 1 : 1;

  return `movies/${yearString}/${monthString}/${dayString}/${fileNumber}.${fileExtension}`;
};

const getOriginalTime = async (filePath: string): Promise<OriginalTime> => {
  return new Promise(resolve => {
    ffmpeg()
      .input(filePath)
      .ffprobe((_, data) => {
        let date: Date;
        // @ts-ignore
        if (data?.format?.tags['com.apple.quicktime.creationdate']) {
          const creationDate = data?.format?.tags[
            // @ts-ignore
            'com.apple.quicktime.creationdate'
          ]
            .split('T')
            .shift();
          date = new Date(creationDate);
        } else {
          date = new Date(0);
        }
        resolve({
          year: date.getFullYear(),
          month: date.getMonth() + 1,
          day: date.getDate(),
        });
      });
  });
};

const createRemoteStorageFile = async (target: string): Promise<Writable> => {
  const storage = new Storage();
  return storage
    .bucket(`${BUCKET_NAME}`)
    .file(target)
    .createWriteStream({
      metadata: {
        contentType: `video/${VIDEO_FORMAT}`,
      },
    });
};

const processAndUpload = async (source: string, storageFile: Writable) =>
  new Promise((resolve, reject) => {
    ffmpeg(source)
      .on('start', () => console.log(`🟢 Start Transcoding ${source}`))
      .on('progress', progress =>
        console.log(`🏭 Processing: ${Number(progress.percent).toFixed(2)} %`),
      )
      .on('error', error => {
        console.error(`💥 Error transcoding file ${source}.`, error);
        reject(error);
      })
      .on('end', () => {
        console.log(' 🏁Transcoding succeeded !');
        resolve(storageFile);
      })
      .size(VIDEO_SIZE)
      .format(VIDEO_FORMAT)
      .videoCodec(VIDEO_CODEC)
      .videoBitrate(VIDEO_BITRATE)
      .audioCodec(AUDIO_CODEC)
      .output(storageFile, { end: true })
      .run();
  });

const main = async ({ source, target }: UploaderIO): Promise<void> => {
  await setEnvironment(target);
  try {
    log(chalk`Get files from: {green ${source}}`);
    // get movies
    const filesPath = await getFilesByPath(source);
    const total = filesPath.length;
    let counter = 1;

    for (const file of filesPath) {
      log(chalk`{inverse ${counter} of ${total}}`);

      // get file path of a movie
      const filePath = getFilePath({ file, source });
      log(chalk`Get file from: {yellow ${filePath}}`);

      // get  Date when movies was filmed
      const { year, month, day } = await getOriginalTime(filePath);

      // get file path from Google Storage bucket
      const uploadFilePath = await getUploadFilePath({
        year,
        month,
        day,
        fileExtension: VIDEO_FORMAT,
      });

      // create file on Google Storage bucket
      const storageFile = await createRemoteStorageFile(uploadFilePath);

      // Process and upload
      log(chalk`{bgYellow {black Delaying for ${DELAY_TIME}ms}}`);
      await delay(DELAY_TIME);

      log(chalk`Processing movie: {blue ${filePath}} 🎥`);
      await processAndUpload(filePath, storageFile);

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
