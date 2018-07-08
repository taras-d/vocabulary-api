const errors = require('@feathersjs/errors');
const _ = require('lodash');

const hooks = require('./words-stats.hooks');

module.exports = function (app) {
  const models = app.get('mongooseClient').models;
  
  class Service {

    async find(params) {
      switch (params.query.type) {
        case 'available-years':
          return this.getAvailableYears(params);
        case 'total-in-month':
          return this.getTotalInMonth(params);
        default:
          throw new errors.BadRequest('Unknown type');
      }
    }

    async getAvailableYears(params) {
      const result = await models.words.aggregate([
        {
          $match: { userId: params.user._id }
        },
        {
          $group: {
            _id: { $year: '$createdAt' }
          }
        }
      ]);

      return result.map(item => item._id);
    }

    async getTotalInMonth(params) {
      const year = +params.query.year || new Date().getFullYear();

      const getTotal = async month => {
        const result = await models.words.aggregate([
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

      const months = _.range(1, 13);
      const result = [];

      for (let i = 0; i < months.length; ++i) {
        result.push({
          month: months[i],
          total: await getTotal(months[i])
        });
      }

      return result;
    }

  }

  // Initialize our service with any options it requires
  app.use('/words-stats', new Service());

  // Get our initialized service so that we can register hooks
  const service = app.service('words-stats');

  service.hooks(hooks);
};
