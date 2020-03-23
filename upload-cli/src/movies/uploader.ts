import ffmpeg from 'fluent-ffmpeg';
import { getFilesByPath, getFilePath, OriginalTime } from '../lib/uploader';
// var stream = require('stream').Writable;
import { Writable } from 'stream';
// import path from 'path';

import fs from 'fs';
const source = '/Users/pataruco/Desktop/movies';

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
      .format('webm')
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

      console.log({ year, month, day });

      // TODO: Create filepath in bucket

      // TODO: This can process and update
      const rotateAndResizeBuffer = await getTranscodedBuffer(filePath);

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
