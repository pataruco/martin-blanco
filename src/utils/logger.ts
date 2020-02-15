import { createLogger, format, transports } from 'winston';
const { label, combine, timestamp, prettyPrint } = format;
// TODO: Add Google StackDriver integration https://github.com/winstonjs/winston/blob/master/docs/transports.md#google-stackdriver-transport

const logger = createLogger({
  format: combine(timestamp(), prettyPrint(), label()),
  transports: [new transports.Console()],
  exitOnError: false,
});

export default logger;
