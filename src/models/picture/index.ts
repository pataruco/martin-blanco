// eslint-disable-next-line no-unused-vars
import { Storage, File } from '@google-cloud/storage';
import dotenv from 'dotenv';
import { ExifParserFactory } from 'ts-exif-parser';
import sharp from 'sharp';

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

interface OriginalTime {
  year: number;
  month: number;
  day: number;
}

const getOriginalTime = async (buffer: Buffer): Promise<OriginalTime> => {
  const data = await ExifParserFactory.create(buffer).parse();
  const originalTime =
    data.tags?.DateTimeOriginal ?? new Date(0).getUTCSeconds();
  const date = new Date(new Date(0).setUTCSeconds(originalTime));
  return {
    year: date.getFullYear(),
    month: date.getMonth(),
    day: date.getDate(),
  };
};

const getRotatedAndResizeBuffer = async (buffer: Buffer): Buffer =>
  await sharp(buffer)
    .rotate()
    .resize(800)
    .toBuffer();

interface BufferToupload extends OriginalTime {
  buffer: Buffer;
}

const uploadToStorage = async (buffers: BufferToupload[]): string[] => {
  /*  TODO: 
    map buffers and per buffer:
      get files length from getFilesBy({year, month, day})/
      Set file number base on length
      Set filename
      Upload to storage
      Get path
      return path
  */
};

export const getStoragePaths = async (buffers: Buffer[]) => {
  const buffersToUpload = await Promise.all(
    buffers.map(async buffer => {
      const { year, month, day } = await getOriginalTime(buffer);
      return {
        year,
        month,
        day,
        buffer: await getRotatedAndResizeBuffer(buffer),
      };
    }),
  );

  const paths = await uploadToStorage(buffersToUpload);
  return paths;
};
