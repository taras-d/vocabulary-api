const _ = require('lodash');

class Service {

  constructor(options) {
    this.options = options;
  }

  setup(app) {
    this.app = app;
  }

  async find(params) {
    return _.omit(params.user, ['password']);
  }

}

module.exports = function(options) {
  return new Service(options);
};

module.exports.Service = Service;