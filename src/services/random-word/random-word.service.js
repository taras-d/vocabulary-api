// Initializes the `random-word` service on path `/random-word`
const createService = require('./random-word.class');
const hooks = require('./random-word.hooks');

module.exports = function (app) {
  // Initialize our service with any options it requires
  app.use('/random-word', createService({}));

  // Get our initialized service so that we can register hooks
  const service = app.service('random-word');

  service.hooks(hooks);
};
