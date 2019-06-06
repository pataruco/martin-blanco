const { getMAnifest } = require('./lib');

exports.handler = async () => {
  const manifest = await getMAnifest();
  const dates = manifest.dates;
  return {
    isBase64Encoded: false,
    statusCode: 200,
    headers: {},
    body: JSON.stringify({
      dates,
    }),
  };
};
