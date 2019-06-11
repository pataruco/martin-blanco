import Joi from '@hapi/joi';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { dateRegex, getDate } from './lib';

const schema = Joi.object().keys({
  dateId: Joi.string()
    .regex(dateRegex)
    .required(),
});

export const handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
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

  const dateId = event && event.pathParameters && event.pathParameters.dateId;

  if (dateId) {
    const date = await getDate(dateId);

    if (Array.isArray(date) && date.length === 0) {
      return {
        isBase64Encoded: false,
        statusCode: 204,
        headers: {},
        body: JSON.stringify({
          message: 'Date not found',
        }),
      };
    }

    return {
      isBase64Encoded: false,
      statusCode: 200,
      headers: {},
      body: JSON.stringify(date),
    };
  }

  return {
    isBase64Encoded: false,
    statusCode: 404,
    headers: {},
    body: JSON.stringify({
      message: 'Date not found',
    }),
  };
};
