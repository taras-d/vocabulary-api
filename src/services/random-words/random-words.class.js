const errors = require('@feathersjs/errors');
const _ = require('lodash');

class Service {

  constructor(options) {
    this.options = options;
  }

  setup(app) {
    this.app = app;
    this.models = app.get('mongooseClient').models;
  }

  async find(params) {
    _.defaults(params.query, { size: '10' });

    await this._checkSize(params);

    const words = await this._getRandomWords(params);
    await this._replaceDuplicates(words);

    return words;
  }

  async _checkSize(params) {
    const count = await this.models.words.count({
      userId: params.user._id
    });

    const size = params.query.size;
    if (size > count) {
      throw new errors.BadRequest(`You should have at least ${size} words in your dictionary`);
    }
  }

  _getRandomWords(params) {
    return this.models.words.aggregate([
      {
        $match: { userId: params.user._id }
      },
      {
        $sample: { size: +params.query.size }
      }
    ]);
  }

  async _replaceDuplicates(words) {
    for (let i = 0; i < words.length; ++i) {
      const dup = words.find((word, j) => i !== j && words[i]._id === word._id);
      if (dup) {
        words[i] = await this.models.words.findOne({
          _id: { $nin: words.map(w => w._id) }
        }).toJSON();
      }
    }
  }
}

module.exports = function(options) {
  return new Service(options);
};

module.exports.Service = Service;