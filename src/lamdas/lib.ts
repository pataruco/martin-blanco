import AWS from 'aws-sdk';
const { POD_BUCKET_NAME } = process.env;
const s3 = new AWS.S3();
const params = {
  Bucket: `${POD_BUCKET_NAME}/production/manifest`,
  Key: 'manifest.json',
};

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
interface File {
  url: string;
}

interface Date {
  date: string;
  files: File[];
}

interface Manifest {
  updated: string;
  dates: Date[];
}

interface FileMessage {
  message: string;
}

const getManifest = async (): Promise<Manifest | null> => {
  try {
    const data = await s3.getObject(params).promise();
    if (data && data.Body) {
      return JSON.parse(data.Body.toString('utf-8'));
    }
  } catch (error) {
    // tslint:disable-next-line:no-console
    console.error(error);
    return null;
  }
  return null;
};

const getFile = (
  date: Date[] | undefined,
  fileId: string,
): FileMessage | File['url'] => {
  const index = Number(fileId) - 1;

  if (date && date.length > 0) {
    const isFileAvailable = index + 1 <= date[0].files.length;

    if (!isFileAvailable) {
      return {
        message: 'File not found',
      };
    }

    if (isFileAvailable) {
      const imagePath = date[0].files[index].url;
      return imagePath;
    }
  }

  return {
    message: 'Date not found',
  };
};

const getPicture = async (fileName: string): Promise<string> => {
  const pictureParams = {
    Bucket: `${POD_BUCKET_NAME}`,
    Key: fileName,
  };

  const data = await s3.getObject(pictureParams).promise();
  if (data && data.Body) {
    return data.Body.toString('base64');
  }
  return '';
};

const getDate = async (dateId: string): Promise<Date[] | undefined> => {
  const manifest = await getManifest();
  if (manifest && manifest.dates) {
    return manifest.dates.filter(date => date.date === dateId);
  }
};

export { dateRegex, getManifest, getDate, getPicture, getFile };
