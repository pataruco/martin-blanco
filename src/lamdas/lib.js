const AWS = require('aws-sdk');
const { POD_BUCKET_NAME } = process.env;
const s3 = new AWS.S3();
const params = {
  Bucket: `${POD_BUCKET_NAME}/production/manifest`,
  Key: 'manifest.json',
};

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

const getManifest = async () => {
  try {
    const data = await s3.getObject(params).promise();
    return JSON.parse(data.Body.toString('utf-8'));
  } catch (error) {
    console.error(error);
  }
};

const getFile = (date, fileId) => {
  const index = parseInt(fileId, 10) - 1;

  if (date.length > 0) {
    const isFileAvailable = index + 1 <= date[0].files.length;

    if (isFileAvailable) {
      const imagePath = date[0].files[index].url;
      return imagePath;
    }

    if (!isFileAvailable) {
      return {
        message: 'File not found',
      };
    }
  }

  if (date.length === 0) {
    return {
      message: 'Date not found',
    };
  }
};

const getPicture = async fileName => {
  const pictureParams = {
    Bucket: `${POD_BUCKET_NAME}`,
    Key: fileName,
  };

  try {
    const data = await s3.getObject(pictureParams).promise();
    return data.Body.toString('base64');
  } catch (error) {
    console.error(error);
  }
};

const getDate = async dateId => {
  const manifest = await getManifest();
  return manifest.dates.filter(date => date.date === dateId);
};

module.exports = { dateRegex, getManifest, getDate, getPicture, getFile };
