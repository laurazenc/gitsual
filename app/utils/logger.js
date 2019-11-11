// @gflow
import winston, { createLogger, format, transports } from 'winston';
import config from '../config';

const { combine, timestamp, label, prettyPrint } = format;

const logger = createLogger({
  level: config.logs.level,
  levels: winston.config.npm.levels,
  format: combine(label(), timestamp(), prettyPrint()),
  transports: [new transports.Console()]
});

export default logger;
