const Joi = require('@hapi/joi');
const { dateRegex, getDate, getPicture, getFile } = require('./lib');

const schema = Joi.object().keys({
  dateId: Joi.string()
    .regex(dateRegex)
    .required(),
  fileId: Joi.number()
    .min(1)
    .integer()
    .required(),
});

exports.handler = async event => {
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

  const { dateId, fileId } = event.pathParameters;

  const date = await getDate(dateId);
  console.log({ date });

  const file = getFile(date, fileId);

  if (date.length === 0 || (date.length > 0 && file.message)) {
    return {
      isBase64Encoded: false,
      statusCode: 204,
      headers: {},
      body: JSON.stringify(file),
    };
  }

  if (!file.message) {
    return {
      isBase64Encoded: true,
      statusCode: 200,
      headers: {
        'Content-type': 'image/jpeg',
      },
      body: await getPicture(file),
    };
  }
};
