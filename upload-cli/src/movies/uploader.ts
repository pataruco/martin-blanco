import ffmpeg from 'fluent-ffmpeg';
// eslint-disable-next-line no-unused-vars
import { Writable } from 'stream';
import dotenv from 'dotenv';
import { Storage } from '@google-cloud/storage';

dotenv.config();

let BUCKET_NAME: string;
const {
  BUCKET_NAME_DEV,
  BUCKET_NAME_PROD,
  GOOGLE_CREDENTIALS_DEV,
  GOOGLE_CREDENTIALS_PROD,
} = process.env;
const DELAY_TIME = 100;

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
} from '../lib/uploader';

const source = '/Users/pataruco/Desktop/movies';

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
  const [allFiles] = await storage.bucket(`${BUCKET_NAME_DEV}`).getFiles({
    autoPaginate: false,
    directory,
  });

  return await Promise.all(
    allFiles
      .filter(file => file.name.includes('.'))
      .map(
        async file =>
          `https://storage.googleapis.com/${BUCKET_NAME_DEV}/${file.name}`,
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
    .bucket(`${BUCKET_NAME_DEV}`)
    .file(target)
    .createWriteStream({
      metadata: {
        contentType: `video/${VIDEO_FORMAT}`,
      },
    });
};

const processAndUpload = async (source: string, target: Writable) =>
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
        resolve(target);
      })
      .size('50%')
      .format(VIDEO_FORMAT)
      .videoCodec('libvpx')
      .videoBitrate('1000k')
      .audioCodec('libvorbis')
      .output(target, { end: true })
      .run();
  });

const main = async () => {
  try {
    // get movies
    const filesPath = await getFilesByPath(source);

    for (const file of filesPath) {
      // get file path of a movie
      const filePath = getFilePath({ file, source });
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
      await processAndUpload(filePath, storageFile);
    }
  } catch (e) {
    console.error(e);
    throw Error(`Error processing upload. ${e}`);
  }
};

// if (!module.parent) {
//   start().then();
// }

export default main;
