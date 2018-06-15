const { authenticate } = require('@feathersjs/authentication').hooks;
const { disableMultiItemChange, disallow } = require('feathers-hooks-common');

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [],
    get: [],
    create: [],
    update: [
      disallow('external')
    ],
    patch: [
      disableMultiItemChange()
    ],
    remove: [
      disableMultiItemChange()
    ]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
