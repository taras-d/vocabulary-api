class Service {

  constructor(options) {
    this.options = options;
  }

  setup(app) {
    this.app = app;
    this.models = app.get('mongooseClient').models;
  }

  async find(params) {
    const result = await this.models.words.aggregate([
      {
        $match: { userId: params.user._id }
      },
      {
        $sample: { size: 1 }
      }
    ]);

    return result[0] || null;
  }

}

module.exports = function(options) {
  return new Service(options);
};

module.exports.Service = Service;