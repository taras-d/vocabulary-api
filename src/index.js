/* eslint-disable no-console */
const logger = require('winston');
const app = require('./app');

const port = process.env.OPENSHIFT_NODEJS_PORT || app.get('port');
const ip = process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';
const server = app.listen(port, ip);

process.on('unhandledRejection', (reason, p) =>
  logger.error('Unhandled Rejection at: Promise ', p, reason)
);

server.on('listening', () =>
  logger.info('Feathers application started on http://%s:%d', app.get('host'), port)
);
