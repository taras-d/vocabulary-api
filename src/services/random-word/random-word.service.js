// Initializes the `random-word` service on path `/random-word`
const hooks = require('./random-word.hooks');

module.exports = function (app) {
  class Service {

    async find() {
      const models = app.get('mongooseClient').models;

      const result = await models.words.aggregate([{
        $sample: { size: 1 }
      }]).exec();

      return result[0] || null;
    }

  }

  // Initialize our service with any options it requires
  app.use('/random-word', new Service());

  // Get our initialized service so that we can register hooks
  const service = app.service('random-word');

  service.hooks(hooks);
};
