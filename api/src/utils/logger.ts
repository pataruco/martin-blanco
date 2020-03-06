import { createLogger, format, transports } from 'winston';
const { combine, timestamp, prettyPrint, json } = format;
import { LoggingWinston } from '@google-cloud/logging-winston';

const logger = createLogger({
  format: combine(timestamp(), prettyPrint(), json()),
  transports: [
    new transports.Console(),
    new LoggingWinston({ inspectMetadata: true }),
  ],
  exitOnError: false,
});

export default logger;
