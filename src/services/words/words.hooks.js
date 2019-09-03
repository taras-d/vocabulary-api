const { authenticate } = require('@feathersjs/authentication').hooks;
const { restrictToOwner } = require('feathers-authentication-hooks');
const { disableMultiItemChange, disallow } = require('feathers-hooks-common');
const errors = require('@feathersjs/errors');
const _ = require('lodash');

const normalizeCreateData = context => {
  const data = Array.isArray(context.data)? context.data: [context.data];
  const words = [];

  data.forEach(word => {
    word.text = _.trim(word.text);
    word.translation = _.trim(word.translation);

    if ( !words.find(w => _.toLower(w.text) === _.toLower(word.text)) ) {
      words.push(word);
    }
  });

  context.data = words;
}

const findWord = (text, userId, model) => {
  const re = new RegExp(`^${_.escapeRegExp(text)}$`, 'i');
  return model.findOne({ text: re, userId }).exec();
};

const skipDuplicates = async context => {
  const user = context.params.user;
  const models = context.app.get('mongooseClient').models;

  const words = context.data;
  const unique = [];
  const duplicates = [];

  for (let i = 0; i < words.length; ++i) {
    const word = words[i];
    if (await findWord(word.text, user._id, models.words)) {
      duplicates.push(word);
    } else {
      word.userId = user._id;
      unique.push(word);
    }
  }

  context.data = unique;

  const result = {
    total: words.length,
    inserted: unique,
    duplicates
  };

  if (unique.length) {
    context.dispatch = result;
  } else {
    context.result = result;
  }
};

const checkWordBeforePatch = async context => {
  const data = context.data;

  if ('translation' in data) {
    data.translation = _.trim(data.translation);
  }

  if ('text' in data) {
    data.text = _.trim(data.text);

    const user = context.params.user;
    const models = context.app.get('mongooseClient').models;
    const word = await findWord(data.text, user._id, models.words);

    if (word && word.id !== context.id) {
      throw new errors.BadRequest(`Another word with text "${data.text}" already exist`);
    }
  }
};

const processSearchParams = context => {
  const query = context.params.query;
  const search = query.$search;

  delete query.$search;

  if (search) {
    const re = new RegExp(_.escapeRegExp(search), 'i');
    query.$or = [
      { text: re },
      { translation: re }
    ];
  }
};

const ownerOnly = restrictToOwner({ idField: '_id', ownerField: 'userId' });

module.exports = {
  before: {
    all: [
      authenticate('jwt'),
    ],
    find: [
      ownerOnly,
      processSearchParams
    ],
    get: [
      ownerOnly
    ],
    create: [
      normalizeCreateData,
      skipDuplicates
    ],
    update: [
      disallow('external')
    ],
    patch: [
      disableMultiItemChange(),
      ownerOnly,
      checkWordBeforePatch
    ],
    remove: [
      disableMultiItemChange(),
      ownerOnly
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
