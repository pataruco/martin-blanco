import Joi from '@hapi/joi';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { dateRegex, getDate, getFile, getPicture } from './lib';

const schema = Joi.object().keys({
  dateId: Joi.string()
    .regex(dateRegex)
    .required(),
  fileId: Joi.number()
    .min(1)
    .integer()
    .required(),
});

export const handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult | undefined> => {
  const { error } = Joi.validate(event.pathParameters, schema);
  if (error) {
    return {
      isBase64Encoded: false,
      statusCode: 400,
      headers: {},
      body: JSON.stringify({
        message: error.details.map(x => x.message).join(', '),
      }),
    };
  }

  if (
    event &&
    event.pathParameters &&
    event.pathParameters.dateId &&
    event.pathParameters.fileId
  ) {
    const { dateId, fileId } = event.pathParameters;

    const date = await getDate(dateId);
    const file = getFile(date, fileId);

    if (
      (date && date.length === 0) ||
      (date && date.length > 0 && file && file.hasOwnProperty('message'))
    ) {
      return {
        isBase64Encoded: false,
        statusCode: 204,
        headers: {},
        body: JSON.stringify(file),
      };
    }

    if (!file.hasOwnProperty('message') && typeof file === 'string') {
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
};
