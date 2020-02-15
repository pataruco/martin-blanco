import winston from 'winston';

const logger = winston.createLogger({
  exitOnError: false,
  level: 'info',
  transports: [
    new winston.transports.Console({
      handleExceptions: true,
      level: 'info',
    }),
  ],
});

export const myStream = {
  write: (text: string) => {
    logger.info(text);
  },
};

export default logger;

// app.use(require('morgan')('combined', { stream: logger.stream }));
