import { APIGatewayProxyResult } from 'aws-lambda';
import { getManifest } from './lib';

export const handler = async (): Promise<APIGatewayProxyResult> => {
  const manifest = await getManifest();

  if (manifest) {
    const { updated } = manifest;
    return {
      isBase64Encoded: false,
      statusCode: 200,
      headers: {},
      body: JSON.stringify({
        updated,
      }),
    };
  }

  return {
    isBase64Encoded: false,
    statusCode: 400,
    headers: {},
    body: JSON.stringify({
      message: 'Updated not found.',
    }),
  };
};
