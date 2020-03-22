import ffmpeg from 'fluent-ffmpeg';
import { getFilesByPath, getFilePath, OriginalTime } from '../lib/uploader';
// import path from 'path';

const source = '/Users/pataruco/Desktop/movies';

// const ffmpeg = Ffmpeg();

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

const start = async () => {
  const filesPath = await getFilesByPath(source);
  let counter = 0;

  for (const file of filesPath) {
    const filePath = getFilePath({ file, source });
    // create path format
    const { year, month, day } = await getOriginalTime(filePath);

    console.log({ filePath, year, month, day });

    // const ffmpeg = Ffmpeg();
    // ffmpeg()
    //   .input(filePath)
    // .size('50%')
    // .format('mp4')
    // .on('progress', progress => {
    //   console.log('Processing: ' + progress.percent + '% done');
    // })
    // .ffprobe((err, data) => {
    // @ts-ignore
    // console.dir(data.format.tags['com.apple.quicktime.creationdate']);
    // });
    // .save(`./${counter}.mp4`);

    // console.log('complete');
  }
};

if (!module.parent) {
  start().then();
}
