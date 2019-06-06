const dateregex = /^\d{4}-\d{2}-\d{2}$/;

const { getDate } = require('./lib');

exports.handler = async event => {
  const dateId = event.pathParameters.dateId;
  const date = await getDate(dateId);
  const isDateString = dateregex.test(dateId);

  if (isDateString && date.length > 0) {
    return {
      isBase64Encoded: false,
      statusCode: 200,
      headers: {},
      body: JSON.stringify(...date),
    };
  }

  if (isDateString && date.length === 0) {
    return {
      isBase64Encoded: false,
      statusCode: 204,
      headers: {},
      body: JSON.stringify({
        message: 'Date not found',
      }),
    };
  }

  if (!isDateString) {
    return {
      isBase64Encoded: false,
      statusCode: 400,
      headers: {},
      body: JSON.stringify({
        message: 'date format should be ISO',
      }),
    };
  }
};
