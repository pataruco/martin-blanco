const Joi = require('@hapi/joi');
const { dateRegex, getDate } = require('./lib');

const schema = Joi.object().keys({
  dateId: Joi.string()
    .regex(dateRegex)
    .required(),
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
        message: error.details.map(x => x.message).join(', '),
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
