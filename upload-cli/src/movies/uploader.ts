import ffmpeg from 'fluent-ffmpeg';
// var stream = require('stream').Writable;
import { Writable } from 'stream';
// import path from 'path';
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

// BUCKET_NAME = BUCKET_NAME_DEV;

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

import fs from 'fs';
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

const getremoteWriteStream = async (target: string): Promise<Writable> => {
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

const processAndUpload = async (source: string, target: string) => {
  const stream = await getremoteWriteStream(target);

  // console.log({ stream });
  new Promise((resolve, reject) => {
    // TODO: Create a file in bucket with createReadStream (https://www.wowza.com/community/questions/48091/ffmpeg-transcode-mp4-from-wowzastreamrecorder-erro.html)
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
        resolve(stream);
      })
      .size('50%')
      .format(VIDEO_FORMAT)
      .videoCodec('libvpx')
      .videoBitrate('1000k')
      .audioCodec('libvorbis')
      .output(stream, { end: true })
      .run();
  });
};

const getTranscodedBuffer = async (filePath: string): Promise<Writable> =>
  new Promise((resolve, reject) => {
    // TODO: Create a file in bucket with createReadStream (https://www.wowza.com/community/questions/48091/ffmpeg-transcode-mp4-from-wowzastreamrecorder-erro.html)
    const stream = fs.createWriteStream('stream.webm');

    ffmpeg(filePath)
      .on('start', () => console.log(`🟢 Start Transcoding ${filePath}`))
      .on('progress', progress =>
        console.log(`🏭 Processing: ${Number(progress.percent).toFixed(2)} %`),
      )
      .on('error', error => {
        console.error(`💥 Error transcoding file ${filePath}.`, error);
        reject(error);
      })
      .on('end', () => {
        console.log(' 🏁Transcoding succeeded !');
        resolve(stream);
      })
      .size('50%')
      .format(VIDEO_FORMAT)
      .videoCodec('libvpx')
      .videoBitrate('1000k')
      .audioCodec('libvorbis')
      .output(stream, { end: true })
      .run();
  });

const start = async () => {
  try {
    const filesPath = await getFilesByPath(source);

    console.log({ filesPath });

    for (const file of filesPath) {
      const filePath = getFilePath({ file, source });
      // create path format
      console.log({ filePath });
      const { year, month, day } = await getOriginalTime(filePath);

      const uploadFilePath = await getUploadFilePath({
        year,
        month,
        day,
        fileExtension: VIDEO_FORMAT,
      });

      console.log({ uploadFilePath });

      // TODO: Create filepath in bucket

      // TODO: This can process and update

      await processAndUpload(filePath, uploadFilePath);
      // const rotateAndResizeBuffer = await getTranscodedBuffer(filePath);

      // console.log({ rotateAndResizeBuffer });

      // ffmpeg.getAvailableFormats(function(err, formats) {
      //   //h264 //mp4
      //   console.log('Available formats:');
      //   console.dir(formats);
      // });

      // ffmpeg.getAvailableCodecs(function(err, codecs) {
      //   console.log('Available codecs:');
      //   console.dir(codecs); //h264 //libx264 //libx265
      // });

      // ffmpeg.getAvailableEncoders(function(err, encoders) {
      //   console.log('Available encoders:');
      //   console.dir(encoders);
      // });
    }
  } catch (e) {
    console.error(e);
    throw Error(`Error processing upload. ${e}`);
  }
};

if (!module.parent) {
  start().then();
}
