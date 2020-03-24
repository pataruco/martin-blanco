import { promises as fs } from 'fs';
import path from 'path';

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

export interface UploadFilePath extends OriginalTime {
  fileExtension?: string;
}

export const getFilesByPath = async (path: string): Promise<string[]> => {
  try {
    return await fs.readdir(path);
  } catch (e) {
    console.error(e);
    throw Error(`Unable to get files from ${path}. ${e}`);
  }
};

export const getFilePath = ({
  source,
  file,
}: {
  source: string;
  file: string;
}): string => path.resolve(source, file);
