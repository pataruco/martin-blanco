import { createLogger, format, transports } from 'winston';
const { combine, timestamp, prettyPrint, json } = format;
import { LoggingWinston } from '@google-cloud/logging-winston';

const logger = createLogger({
  format: combine(timestamp(), prettyPrint(), json()),
  transports: [new LoggingWinston(), new transports.Console()],
  exitOnError: false,
});

export default logger;
