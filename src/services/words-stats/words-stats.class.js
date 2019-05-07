/* eslint-disable no-unused-vars */
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
    switch (params.query.type) {
      case 'available-years':
        return this._getAvailableYears(params);
      case 'total-in-month':
        return this._getTotalInMonth(params);
      default:
        throw new errors.BadRequest('Unknown type');
    }
  }

  async _getAvailableYears(params) {
    const result = await this.models.words.aggregate([
      {
        $match: { userId: params.user._id }
      },
      {
        $group: {
          _id: { $year: '$createdAt' }
        }
      },
      {
        $sort: { _id: -1 }
      }
    ]);

    return result.map(item => item._id);
  }

  async _getTotalInMonth(params) {
    const year = +params.query.year || new Date().getFullYear();

    const getTotal = async month => {
      const result = await this.models.words.aggregate([
        {
          $match: { userId: params.user._id }
        },
        {
          $project: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          }
        },
        {
          $match: { year, month }
        },
        {
          $count: 'count'
        }
      ]);
      return _.get(result, '[0].count', 0);
    };

    const result = [];

    for (let i = 0; i < 12; ++i) {
      result.push(await getTotal(i + 1));
    }

    return result;
  }

}

module.exports = function(options) {
  return new Service(options);
};

module.exports.Service = Service;