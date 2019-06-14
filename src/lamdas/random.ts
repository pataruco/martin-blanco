import { APIGatewayProxyResult } from 'aws-lambda';
import { getManifest, getPicture, getRandomNumber } from './lib';

export const handler = async (): Promise<APIGatewayProxyResult> => {
  const manifest = await getManifest();
  if (manifest && manifest.dates) {
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
  }

  return {
    isBase64Encoded: false,
    statusCode: 400,
    headers: {},
    body: JSON.stringify({
      message: 'file not found',
    }),
  };
};
