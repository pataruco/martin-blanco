const { getDate } = require('./lib');

const Joi = require('@hapi/joi');

const schema = Joi.object().keys({
  dateId: Joi.date(),
});

exports.handler = async event => {
  const dateId = event.pathParameters.dateId;
  const date = await getDate(dateId);

  const { error } = Joi.validate(event.pathParameters, schema);

  if (error) {
    return {
      isBase64Encoded: false,
      statusCode: 400,
      headers: {},
      body: JSON.stringify({
        message: 'date format should be ISO',
      }),
    };
  }

  if (date.length === 0) {
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
    body: JSON.stringify(...date),
  };
};
