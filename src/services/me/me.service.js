const _ = require('lodash');

const createService = require('./me.class');
const hooks = require('./me.hooks');

module.exports = function (app) {
  // Initialize our service with any options it requires
  app.use('/me', createService({}));

  // Get our initialized service so that we can register hooks
  const service = app.service('me');

  service.hooks(hooks);
};
