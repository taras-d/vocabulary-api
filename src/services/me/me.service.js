const _ = require('lodash');

const hooks = require('./me.hooks');

module.exports = function (app) {
  class Service {

    async find(params) {
      return _.omit(params.user, ['password']);
    }

  }

  // Initialize our service with any options it requires
  app.use('/me', new Service());

  // Get our initialized service so that we can register hooks
  const service = app.service('me');

  service.hooks(hooks);
};
