const winston = require('winston');
const logging = require('./src/logging/index.ts');

const console = new winston.transports.Console();
const logFiles = new winston.transports.File({
  level: 'debug',
  filename: 'test.log',
});
console.log('Adding logger');
logging.logger.add(console).add(logFiles);
