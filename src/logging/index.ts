/**
 * @copyright 2020 Yogesh Sajanikar
 */

import * as winston from 'winston';

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: {library: 'async-functional'},
  transports: [],
});
