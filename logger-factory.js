const { createLogger, format, transports } = require('winston');
const { cli, combine, colorize, timestamp, label, printf, splat } = format;
//const expressWinston = require('express-winston');

const loggerFactory = service =>
  createLogger({
    level: 'info',
    format: combine(
      colorize(),
      timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
      }),
      splat(),
      printf(
        info => `${info.timestamp} ${info.level} [${service}]: ${info.message}`
      )
    ),
    defaultMeta: { service },
    transports: [new transports.Console()]
  });

module.exports = { loggerFactory };
