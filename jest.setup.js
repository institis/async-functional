const winston = require('winston');
const logging = require('./src/logging/index.ts');

const logFiles = new winston.transports.File({
  level: 'debug',
  filename: 'test.log',
});

logging.logger.add(logFiles);
