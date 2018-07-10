const createService = require('./words-stats.class');
const hooks = require('./words-stats.hooks');

module.exports = function (app) {

  // Initialize our service with any options it requires
  app.use('/words-stats', createService({}));

  // Get our initialized service so that we can register hooks
  const service = app.service('words-stats');

  service.hooks(hooks);
};
