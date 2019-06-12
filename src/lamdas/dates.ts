import { getManifest } from './lib';

export const handler = async () => {
  const manifest = await getManifest();
  const dates = manifest && manifest.dates;
  return {
    isBase64Encoded: false,
    statusCode: 200,
    headers: {},
    body: JSON.stringify({
      dates,
    }),
  };
};
