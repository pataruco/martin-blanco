const { getManifest, getPicture } = require('./lib');

const getRandomNumber = maxNumber => Math.floor(Math.random() * maxNumber) + 1;

exports.handler = async () => {
  const manifest = await getManifest();
  const maxDatesNumber = manifest.dates.length;
  const randomDateNumber = getRandomNumber(maxDatesNumber);
  const randomDate = manifest.dates[randomDateNumber - 1];
  const maxFileNumber = randomDate.files.length;
  const randomFileNumber = getRandomNumber(maxFileNumber);
  const file = randomDate.files[randomFileNumber - 1].url;

  if (file) {
    return {
      isBase64Encoded: true,
      statusCode: 200,
      headers: {
        'Content-type': 'image/jpeg',
      },
      body: await getPicture(file),
    };
  }

  return {
    isBase64Encoded: true,
    statusCode: 400,
    headers: {},
    body: JSON.stringify({
      message: 'file not found',
    }),
  };
};
