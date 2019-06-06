const AWS = require('aws-sdk');
const { POD_BUCKET_NAME } = process.env;
const s3 = new AWS.S3();
const params = {
  Bucket: `${POD_BUCKET_NAME}/production/manifest`,
  Key: 'manifest.json',
};

const getManifest = async () => {
  try {
    const data = await s3.getObject(params).promise();
    return JSON.parse(data.Body.toString('utf-8'));
  } catch (error) {
    console.error(error);
  }
};

const getDate = async dateId => {
  const manifest = await getManifest();
  return manifest.dates.filter(date => date.date === dateId);
};

module.exports = { getManifest, getDate };
