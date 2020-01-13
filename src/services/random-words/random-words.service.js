// Initializes the `random-word` service on path `/random-word`
const createService = require('./random-words.class');
const hooks = require('./random-words.hooks');

module.exports = function (app) {
  // Initialize our service with any options it requires
  app.use('/random-words', createService({}));

  // Get our initialized service so that we can register hooks
  const service = app.service('random-words');

  service.hooks(hooks);
};
